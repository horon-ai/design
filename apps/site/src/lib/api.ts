/**
 * Reads the library's own source to document an API instead of duplicating it.
 *
 * The page renders a props table, an import line and the Flutter class names,
 * and each of those has exactly one source of truth: `packages/react/src/
 * components/<slug>.tsx` and `packages/flutter/lib/src/components/<slug>.dart`.
 * A TypeScript program over the package entry point resolves default values,
 * JSDoc and inherited prop groups, so a renamed prop breaks the docs build
 * rather than silently shipping a stale table.
 *
 * The program is built once per process and cached; each page asks for one
 * component out of it.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/** One row of the props table. `type` is already display-ready. */
export interface PropRow {
  name: string;
  optional: boolean;
  type: string;
  defaultValue?: string;
  description: string;
}

/** One exported component of a source file, with its own props and inherited groups. */
export interface ComponentApi {
  name: string;
  description: string;
  props: PropRow[];
  inherited: { source: string; count: number }[];
}

const ENTRY = join("packages", "react", "src", "index.ts");
const FLUTTER_DIR = join("packages", "flutter", "lib", "src", "components");
/** Long type strings are replaced by their alias so the table stays one line per row. */
const MAX_TYPE_LENGTH = 120;
/** An import line longer than this wraps one name per line. */
const MAX_IMPORT_LENGTH = 80;

let root: string | undefined;

/**
 * Finds the repository root by walking up from this module and then from the
 * working directory. `import.meta.url` is a real file under `bun test` and in
 * `astro dev`, and may point inside the build output in a production build; both
 * starts reach the root because the marker file sits at a fixed depth below it.
 */
function findRoot(): string {
  if (root !== undefined) return root;

  const starts: string[] = [];
  try {
    starts.push(dirname(fileURLToPath(import.meta.url)));
  } catch {
    /* A bundled build can drop `import.meta.url`; the working directory still walks up. */
  }
  starts.push(process.cwd());

  for (const start of starts) {
    let current = resolve(start);
    for (;;) {
      if (existsSync(join(current, ENTRY))) {
        root = current;
        return current;
      }
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }

  throw new Error(`api.ts: could not find the repository root (looked for ${ENTRY})`);
}

let program: ts.Program | undefined;
let cachedChecker: ts.TypeChecker | undefined;

/** The program over the package entry point, built on first use. */
function getChecker(): ts.TypeChecker {
  if (program === undefined) {
    program = ts.createProgram([join(findRoot(), ENTRY)], {
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      skipLibCheck: true,
      noEmit: true,
    });
  }
  cachedChecker ??= program.getTypeChecker();
  return cachedChecker;
}

/** `{@link Foo}` reads as `Foo` and backticks drop out, so a JSDoc line reads as plain prose in a cell. */
function cleanProse(text: string): string {
  return text
    .replace(/\{@link(?:code|plain)?\s+([^|}]+)(?:\|[^}]*)?\}/g, (_match, name: string) => name.trim())
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** The component's JSDoc, first paragraph only: the rest is usually an `@example` block. */
function firstParagraph(symbol: ts.Symbol | undefined, checker: ts.TypeChecker): string {
  if (symbol === undefined) return "";
  const raw = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  const [first = ""] = raw.split(/\n\s*\n/);
  return cleanProse(first);
}

/** The `@default` tag, kept verbatim so `"primary"` renders with its quotes. */
function defaultTag(symbol: ts.Symbol, checker: ts.TypeChecker): string | undefined {
  for (const tag of symbol.getJsDocTags(checker)) {
    if (tag.name !== "default") continue;
    const text = ts.displayPartsToString(tag.text).trim();
    if (text.length > 0) return text;
  }
  return undefined;
}

/** The union a type alias points at, when `node` is a reference such as `ButtonVariant`. */
function referencedUnion(node: ts.TypeNode, checker: ts.TypeChecker): ts.UnionTypeNode | undefined {
  if (!ts.isTypeReferenceNode(node)) return undefined;
  const symbol = checker.getSymbolAtLocation(node.typeName);
  for (const declaration of symbol?.getDeclarations() ?? []) {
    if (ts.isTypeAliasDeclaration(declaration) && ts.isUnionTypeNode(declaration.type)) return declaration.type;
  }
  return undefined;
}

/** The type node written on a property, when its declaration has one. */
function propertyTypeNode(prop: ts.Symbol): ts.TypeNode | undefined {
  for (const declaration of prop.getDeclarations() ?? []) {
    if (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) return declaration.type;
  }
  return undefined;
}

/**
 * The string literals of a declared union, in source order, so a variant list
 * reads `"primary" | "glass" | …` like the type alias does rather than in the
 * order the checker happened to sort them.
 */
function declaredLiterals(prop: ts.Symbol, checker: ts.TypeChecker): string[] | undefined {
  const node = propertyTypeNode(prop);
  if (node === undefined) return undefined;
  const union = ts.isUnionTypeNode(node) ? node : referencedUnion(node, checker);
  if (union === undefined) return undefined;

  const members = union.types.filter((member) => member.kind !== ts.SyntaxKind.UndefinedKeyword);
  if (members.length < 2) return undefined;

  const names: string[] = [];
  for (const member of members) {
    if (!ts.isLiteralTypeNode(member) || !ts.isStringLiteral(member.literal)) return undefined;
    names.push(member.literal.text);
  }
  return names;
}

/** The type column: literal unions fully spelled out, everything else one line. */
function displayType(checker: ts.TypeChecker, prop: ts.Symbol, declaration: ts.Declaration | undefined): string {
  const literals = declaredLiterals(prop, checker);
  if (literals !== undefined) return literals.map((value) => JSON.stringify(value)).join(" | ");
  if (declaration === undefined) return "unknown";

  const type = checker.getTypeOfSymbolAtLocation(prop, declaration);
  const optional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
  const shown = optional ? checker.getNonNullableType(type) : type;
  const text = checker
    .typeToString(shown, declaration, ts.TypeFormatFlags.NoTruncation)
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= MAX_TYPE_LENGTH) return text;

  // An expansion of a named type is noise in a table cell; the written name is not.
  const written = propertyTypeNode(prop)?.getText().replace(/\s+/g, " ").trim();
  if (written !== undefined && written.length <= MAX_TYPE_LENGTH) return written;
  return shown.aliasSymbol?.getName() ?? `${text.slice(0, MAX_TYPE_LENGTH - 3)}…`;
}

/** Where an inherited prop comes from, named the way the docs sentence reads it. */
function sourceLabel(fileName: string): string {
  const baseUi = /@base-ui\/react\/(?:esm\/)?([^/]+)\//.exec(fileName);
  if (baseUi?.[1] !== undefined) return `Base UI ${baseUi[1]}`;
  if (fileName.includes("@types/react")) return "HTML attributes";
  const packageName = /node_modules\/((?:@[^/]+\/)?[^/]+)\//.exec(fileName);
  if (packageName?.[1] !== undefined) return packageName[1];
  return "React";
}

/** One exported component: the identifier that names it and the node that carries its signature. */
interface ComponentDeclaration {
  name: ts.Identifier;
  signatureNode: ts.SignatureDeclaration;
}

/** Whether a declaration carries the `export` modifier. */
function isExported(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

/** Every exported PascalCase function, const arrow and class in `source`, in source order. */
function componentDeclarations(source: ts.SourceFile): ComponentDeclaration[] {
  const declared: ComponentDeclaration[] = [];

  for (const statement of source.statements) {
    if (ts.isFunctionDeclaration(statement)) {
      if (statement.name !== undefined && isExported(statement) && /^[A-Z]/.test(statement.name.text)) {
        declared.push({ name: statement.name, signatureNode: statement });
      }
      continue;
    }
    if (!ts.isVariableStatement(statement) || !isExported(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !/^[A-Z]/.test(declaration.name.text)) continue;
      const initializer = declaration.initializer;
      if (initializer !== undefined && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
        declared.push({ name: declaration.name, signatureNode: initializer });
      }
    }
  }

  return declared;
}

/** The props of one component: own rows for the table, inherited props counted per source. */
function propsOf(
  signature: ts.Signature,
  checker: ts.TypeChecker,
): { props: PropRow[]; inherited: { source: string; count: number }[] } {
  const parameter = signature.parameters[0];
  const declaration = parameter?.valueDeclaration;
  if (parameter === undefined || declaration === undefined) return { props: [], inherited: [] };

  const ownPrefix = "/packages/react/src/";
  const type = checker.getTypeOfSymbolAtLocation(parameter, declaration);
  const props: PropRow[] = [];
  const groups = new Map<string, number>();

  for (const prop of type.getProperties()) {
    const propDeclaration = prop.getDeclarations()?.[0];
    // Compared as a path segment, not against the resolved root: the checker
    // reports real paths, which differ from the root when it is reached
    // through a symlink.
    const fileName = (propDeclaration?.getSourceFile().fileName ?? "").replace(/\\/g, "/");

    if (fileName.includes(ownPrefix)) {
      const row: PropRow = {
        name: prop.getName(),
        optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
        type: displayType(checker, prop, propDeclaration),
        description: cleanProse(ts.displayPartsToString(prop.getDocumentationComment(checker))),
      };
      const fallback = defaultTag(prop, checker);
      if (fallback !== undefined) row.defaultValue = fallback;
      props.push(row);
      continue;
    }

    const label = sourceLabel(fileName);
    groups.set(label, (groups.get(label) ?? 0) + 1);
  }

  const inherited = [...groups.entries()]
    .map(([source, count]) => ({ source, count }))
    .toSorted((a, b) => a.source.localeCompare(b.source));

  return { props, inherited };
}

/** The program's copy of `packages/react/src/components/<slug>.tsx`, matched by path tail. */
function componentSource(slug: string): ts.SourceFile | undefined {
  const suffix = `/packages/react/src/components/${slug}.tsx`;
  return program
    ?.getSourceFiles()
    .find((file) => file.fileName.replace(/\\/g, "/").endsWith(suffix));
}

/** Every exported component of `packages/react/src/components/<slug>.tsx`. */
export function componentApi(slug: string): ComponentApi[] {
  const checker = getChecker();
  const source = componentSource(slug);
  if (source === undefined) return [];

  const api: ComponentApi[] = [];
  for (const declaration of componentDeclarations(source)) {
    const signature = checker.getSignatureFromDeclaration(declaration.signatureNode);
    if (signature === undefined) continue;
    const { props, inherited } = propsOf(signature, checker);
    api.push({
      name: declaration.name.text,
      description: firstParagraph(checker.getSymbolAtLocation(declaration.name), checker),
      props,
      inherited,
    });
  }
  return api;
}

/** The import line a reader copies: every PascalCase value export of the file. */
export function reactImport(slug: string): string {
  const source = componentSource(slug);
  const names = (source ? componentDeclarations(source) : []).map((declaration) => declaration.name.text);

  if (names.length === 0) return 'import * as horon from "@horon-ai/react";';
  const single = `import { ${names.join(", ")} } from "@horon-ai/react";`;
  if (single.length <= MAX_IMPORT_LENGTH) return single;
  return ["import {", ...names.map((name) => `  ${name},`), '} from "@horon-ai/react";'].join("\n");
}

/** Public `Horon*` classes the Flutter package ships for this component. */
export function flutterClasses(slug: string): string[] {
  const path = join(findRoot(), FLUTTER_DIR, `${slug}.dart`);
  if (!existsSync(path)) return [];

  const names: string[] = [];
  for (const match of readFileSync(path, "utf8").matchAll(/^class (Horon[A-Za-z0-9_]+)/gm)) {
    names.push(match[1]);
  }
  return names;
}
