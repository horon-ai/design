/**
 * Compares every component's public props between `@horon-ai/react` and a port
 * (`@horon-ai/expo`) with the TypeScript checker, so the parity gate covers what
 * a caller writes at the call site and not only the exported names.
 *
 * For each slug and each exported PascalCase component, every React prop is
 * sorted by where it is declared:
 *
 * - `own`: under `packages/react/src`. It must exist on the port with the same
 *   optionality, the same string-literal set and the same default (the
 *   `@default` tag, else the destructuring initializer).
 * - `base-ui`: inherited from `@base-ui/react`. It is part of the component's
 *   behavior (`open`, `onValueChange`, `orientation`), so it must exist on the
 *   port with the same optionality and literal set. Base UI documents its
 *   defaults in its own d.ts, so defaults are not compared for these.
 * - `dom`: inherited from `@types/react` (`onKeyDown`, `tabIndex`, `aria-*`).
 *   These describe a DOM element the ports do not have, so they are only counted.
 *
 * The port's test file lists the differences its platform forces, each with a
 * reason, and fails on any other difference.
 *
 *   bun test/props-parity.ts   # print the props differences against each port
 */
import { dirname, join, resolve } from "node:path";

import ts from "typescript";

export type PropSource = "own" | "base-ui" | "dom";
export type PropDifferenceKind = "missing-component" | "missing-prop" | "optional" | "literals" | "default";

export interface PropDifference {
  /** `slug:Component.prop`, the key the allow-list uses. */
  key: string;
  source: PropSource;
  kind: PropDifferenceKind;
  detail: string;
}

export interface PropParityReport {
  components: { react: number; port: number; matched: number };
  /** Props per source: how many React has and how many the port matches exactly. */
  props: Record<PropSource, { react: number; matched: number }>;
  differences: PropDifference[];
}

interface PropInfo {
  source: PropSource;
  optional: boolean;
  literals?: string[];
  defaultValue?: string;
}

const packagesDir = resolve(import.meta.dir, "../packages");

/** The ports compared against `@horon-ai/react`, by package directory. */
export type Port = "expo";

function loadProgram(pkg: string): ts.Program {
  const configPath = join(packagesDir, pkg, "tsconfig.json");
  const config = ts.readConfigFile(configPath, (path) => ts.sys.readFile(path));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, dirname(configPath));
  const roots = parsed.fileNames.filter((file) => file.includes(`/packages/${pkg}/src/components/`));
  return ts.createProgram(roots, { ...parsed.options, noEmit: true, skipLibCheck: true });
}

function isExported(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

/** Exported PascalCase components of a file, keyed by name, with the node whose first parameter carries the props. */
function components(source: ts.SourceFile): Map<string, ts.SignatureDeclaration> {
  const found = new Map<string, ts.SignatureDeclaration>();
  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      isExported(statement) &&
      /^[A-Z]/.test(statement.name.text)
    ) {
      found.set(statement.name.text, statement);
      continue;
    }
    if (!ts.isVariableStatement(statement) || !isExported(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !/^[A-Z]/.test(declaration.name.text)) continue;
      const init = declaration.initializer;
      if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) found.set(declaration.name.text, init);
    }
  }
  return found;
}

/** The sorted string literals of a union, or `undefined` when any member is not a string literal. */
function literalSet(type: ts.Type): string[] | undefined {
  const members = type.isUnion() ? type.types : [type];
  const literals: string[] = [];
  for (const member of members) {
    if (member.flags & ts.TypeFlags.Undefined) continue;
    if (!member.isStringLiteral()) return undefined;
    literals.push(member.value);
  }
  return literals.length >= 2 ? literals.toSorted() : undefined;
}

/** Destructuring initializers of the first parameter, as source text. */
function bindingDefaults(signature: ts.SignatureDeclaration): Map<string, string> {
  const defaults = new Map<string, string>();
  const first = signature.parameters[0];
  if (!first || !ts.isObjectBindingPattern(first.name)) return defaults;
  for (const element of first.name.elements) {
    if (!element.initializer) continue;
    const key = element.propertyName ?? element.name;
    if (ts.isIdentifier(key) || ts.isStringLiteral(key)) defaults.set(key.text, element.initializer.getText());
  }
  return defaults;
}

function propsOf(program: ts.Program, signature: ts.SignatureDeclaration, pkg: string): Map<string, PropInfo> {
  const checker = program.getTypeChecker();
  const props = new Map<string, PropInfo>();
  const first = signature.parameters[0];
  if (!first) return props;
  const defaults = bindingDefaults(signature);
  for (const prop of checker.getPropertiesOfType(checker.getTypeAtLocation(first))) {
    const files = (prop.getDeclarations() ?? []).map((declaration) => declaration.getSourceFile().fileName);
    const source: PropSource = files.some((file) => file.includes(`/packages/${pkg}/src/`))
      ? "own"
      : files.some((file) => file.includes("/@base-ui/"))
        ? "base-ui"
        : "dom";
    const tag = prop.getJsDocTags(checker).find((entry) => entry.name === "default");
    const tagText = tag ? ts.displayPartsToString(tag.text).trim() : "";
    props.set(prop.getName(), {
      source,
      optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
      literals: literalSet(checker.getTypeOfSymbolAtLocation(prop, first)),
      // Quote style and inner spacing do not change a default.
      defaultValue: (tagText || defaults.get(prop.getName()))?.replace(/'/g, '"').replace(/\s+/g, " ").trim(),
    });
  }
  return props;
}

export function compareProps(port: Port): PropParityReport {
  const react = loadProgram("react");
  const target = loadProgram(port);
  const report: PropParityReport = {
    components: { react: 0, port: 0, matched: 0 },
    props: { own: { react: 0, matched: 0 }, "base-ui": { react: 0, matched: 0 }, dom: { react: 0, matched: 0 } },
    differences: [],
  };

  for (const reactFile of react.getRootFileNames().toSorted()) {
    const slug = reactFile.replace(/^.*\/components\//, "").replace(/\.tsx$/, "");
    const reactSource = react.getSourceFile(reactFile);
    const portSource = target.getSourceFile(join(packagesDir, port, "src/components", `${slug}.tsx`));
    if (!reactSource) continue;
    const reactComponents = components(reactSource);
    const portComponents = portSource ? components(portSource) : new Map<string, ts.SignatureDeclaration>();
    report.components.react += reactComponents.size;
    report.components.port += portComponents.size;

    for (const [name, reactSignature] of reactComponents) {
      const portSignature = portComponents.get(name);
      const reactProps = propsOf(react, reactSignature, "react");
      for (const info of reactProps.values()) report.props[info.source].react += 1;
      if (!portSignature) {
        report.differences.push({
          key: `${slug}:${name}`,
          source: "own",
          kind: "missing-component",
          detail: `no ${port} component`,
        });
        continue;
      }
      report.components.matched += 1;
      const portProps = propsOf(target, portSignature, port);
      for (const [prop, info] of reactProps) {
        const other = portProps.get(prop);
        if (info.source === "dom") {
          if (other) report.props.dom.matched += 1;
          continue;
        }
        const found: PropDifference[] = [];
        const push = (kind: PropDifferenceKind, detail: string) =>
          found.push({ key: `${slug}:${name}.${prop}`, source: info.source, kind, detail });
        if (!other) {
          push("missing-prop", `absent on ${port}`);
        } else {
          if (info.optional !== other.optional)
            push(
              "optional",
              `React ${info.optional ? "optional" : "required"}, ${port} ${other.optional ? "optional" : "required"}`,
            );
          if (info.literals && info.literals.join("|") !== (other.literals ?? []).join("|")) {
            push("literals", `React [${info.literals.join(", ")}], ${port} [${(other.literals ?? []).join(", ")}]`);
          }
          if (info.source === "own" && info.defaultValue !== other.defaultValue)
            push("default", `React ${info.defaultValue ?? "none"}, ${port} ${other.defaultValue ?? "none"}`);
        }
        if (found.length === 0) report.props[info.source].matched += 1;
        report.differences.push(...found);
      }
    }
  }
  return report;
}

if (import.meta.main) {
  const report = compareProps("expo");
  console.log(JSON.stringify({ components: report.components, props: report.props }));
  for (const difference of report.differences)
    console.log(`${difference.key} [${difference.source} ${difference.kind}] ${difference.detail}`);
}
