import { type BundledLanguage, codeToTokensBase } from "shiki";

/**
 * A token's meaning, not its colour: the site maps roles to its own palette so
 * light and dark follow the theme without a Shiki theme of our own. Tailwind
 * class strings get their own roles so a class reads as variant, utility,
 * value and modifier instead of one flat string.
 */
export type CodeRole =
  | "plain"
  | "keyword"
  | "operator"
  | "function"
  | "tag"
  | "type"
  | "attribute"
  | "property"
  | "string"
  | "number"
  | "punctuation"
  | "comment"
  | "tw-variant"
  | "tw-utility"
  | "tw-value"
  | "tw-modifier";

export interface CodeToken {
  content: string;
  role: CodeRole;
}

const LANG_ALIASES: Record<string, BundledLanguage> = { sh: "bash", shell: "bash", ts: "typescript", js: "javascript" };

const matches = (scope: string, prefixes: string[]) =>
  prefixes.some((prefix) => scope === prefix || scope.startsWith(`${prefix}.`));

const STRING_CUES = ["meta.template.expression", "meta.embedded"];

/** A scope stack runs outermost first; the innermost scope that means something decides the role. */
function roleOf(scopes: string[]): CodeRole {
  if (scopes.some((scope) => matches(scope, ["comment"]))) return "comment";

  // Strings own their quotes, but a template expression or embedded language inside one is real code.
  const stringIndex = scopes.findLastIndex((scope) => matches(scope, ["string"]));
  if (stringIndex !== -1) {
    const deeper = scopes.slice(stringIndex + 1);
    if (!deeper.some((scope) => !matches(scope, ["punctuation"]) && !matches(scope, STRING_CUES))) return "string";
  }

  for (const scope of scopes.toReversed()) {
    if (scope === "entity.name.tag.yaml") return "property";
    if (matches(scope, ["support.type.property-name"])) return "property";
    if (matches(scope, ["support.class.component"])) return "type";
    if (matches(scope, ["keyword.operator"])) return "operator";
    if (matches(scope, ["storage.type.function.arrow"])) return "operator";
    if (matches(scope, ["keyword"])) return "keyword";
    if (matches(scope, ["storage"])) return "keyword";
    if (matches(scope, ["variable.language"])) return "keyword";
    if (matches(scope, ["entity.name.function"])) return "function";
    if (matches(scope, ["support.function"])) return "function";
    if (matches(scope, ["entity.name.command"])) return "function";
    if (matches(scope, ["entity.name.tag"])) return "tag";
    if (matches(scope, ["entity.name.type"])) return "type";
    if (matches(scope, ["support.type"])) return "type";
    if (matches(scope, ["support.class"])) return "type";
    if (matches(scope, ["entity.other.inherited-class"])) return "type";
    if (matches(scope, ["entity.name.class"])) return "type";
    if (matches(scope, ["entity.other.attribute-name"])) return "attribute";
    if (matches(scope, ["constant.other.option"])) return "attribute";
    if (matches(scope, ["variable.other.property"])) return "property";
    if (matches(scope, ["variable.other.object.property"])) return "property";
    if (matches(scope, ["meta.object-literal.key"])) return "property";
    if (matches(scope, ["constant.numeric"])) return "number";
    if (matches(scope, ["constant.language"])) return "number";
    if (matches(scope, ["constant.character"])) return "number";
    if (matches(scope, ["constant.other"])) return "number";
    if (matches(scope, ["support.constant"])) return "number";
    if (matches(scope, ["punctuation"])) return "punctuation";
    if (matches(scope, ["meta.brace"])) return "punctuation";
  }
  return "plain";
}

/** Tailwind helpers whose string arguments are class lists rather than prose. */
const CLASS_FUNCTIONS = new Set(["cn", "clsx", "cx", "cva", "twMerge", "tv"]);

/** Multi-segment roots: the whole prefix is the utility, so a dash inside it is not a value separator. */
const MULTI_SEGMENT_ROOTS = [
  "underline-offset",
  "backdrop-blur",
  "scroll-m",
  "scroll-p",
  "min-w",
  "max-w",
  "min-h",
  "max-h",
  "inset-x",
  "inset-y",
  "gap-x",
  "gap-y",
  "space-x",
  "space-y",
  "divide-x",
  "divide-y",
  "translate-x",
  "translate-y",
  "scale-x",
  "scale-y",
  "grid-cols",
  "grid-rows",
  "col-span",
  "col-start",
  "col-end",
  "row-span",
  "line-clamp",
  "drop-shadow",
  "rounded-tl",
  "rounded-tr",
  "rounded-bl",
  "rounded-br",
  "rounded-t",
  "rounded-b",
  "rounded-l",
  "rounded-r",
  "border-t",
  "border-b",
  "border-l",
  "border-r",
  "border-x",
  "border-y",
  "auto-cols",
  "auto-rows",
  "place-items",
  "place-content",
  "place-self",
].toSorted((left, right) => right.length - left.length);

/** Index of `char` at bracket depth 0, scanning from the end, or -1. */
function lastIndexOutside(text: string, char: string): number {
  let depth = 0;
  for (let index = text.length - 1; index >= 0; index -= 1) {
    const current = text[index];
    if (current === "]" || current === ")") depth += 1;
    else if (current === "[" || current === "(") depth = Math.max(0, depth - 1);
    else if (current === char && depth === 0) return index;
  }
  return -1;
}

/** Index of the first `-` at bracket depth 0, or -1. */
function firstDashOutside(text: string): number {
  let depth = 0;
  for (let index = 0; index < text.length; index += 1) {
    const current = text[index];
    if (current === "[" || current === "(") depth += 1;
    else if (current === "]" || current === ")") depth = Math.max(0, depth - 1);
    else if (current === "-" && depth === 0) return index;
  }
  return -1;
}

function utilityRoot(body: string): string | null {
  for (const root of MULTI_SEGMENT_ROOTS) {
    if (body === root) return root;
    if (body.startsWith(`${root}-`)) return root;
  }
  const dash = firstDashOutside(body);
  return dash > 0 ? body.slice(0, dash) : null;
}

/** Arbitrary values keep their brackets and everything inside them. */
function pushValue(text: string, out: CodeToken[]) {
  const push = (content: string, role: CodeRole) => {
    if (content) out.push({ content, role });
  };
  let buffer = "";
  const flush = () => {
    push(buffer, "tw-value");
    buffer = "";
  };
  let index = 0;
  while (index < text.length) {
    const open = text[index];
    if (open !== "[" && open !== "(") {
      buffer += open;
      index += 1;
      continue;
    }
    flush();
    const close = open === "[" ? "]" : ")";
    let depth = 0;
    let end = index + 1;
    for (; end < text.length; end += 1) {
      if (text[end] === open) depth += 1;
      else if (text[end] === close) {
        if (depth === 0) break;
        depth -= 1;
      }
    }
    const inner = text.slice(index + 1, end);
    push(open, "punctuation");
    push(inner, "tw-value");
    if (end < text.length) push(close, "punctuation");
    index = end + 1;
  }
  flush();
}

function pushUtility(text: string, out: CodeToken[]) {
  const push = (content: string, role: CodeRole) => {
    if (content) out.push({ content, role });
  };
  let start = 0;
  let end = text.length;
  while (start < end && (text[start] === "!" || text[start] === "-")) {
    push(text[start], "tw-modifier");
    start += 1;
  }
  let trailingBang = false;
  if (end > start && text[end - 1] === "!") {
    trailingBang = true;
    end -= 1;
  }
  let body = text.slice(start, end);
  let opacity: string | null = null;
  const slash = lastIndexOutside(body, "/");
  if (slash !== -1) {
    opacity = body.slice(slash + 1);
    body = body.slice(0, slash);
  }
  const root = utilityRoot(body);
  if (root === null) {
    push(body, "tw-utility");
  } else {
    push(root, "tw-utility");
    const rest = body.slice(root.length);
    if (rest.startsWith("-")) {
      push("-", "punctuation");
      pushValue(rest.slice(1), out);
    } else {
      pushValue(rest, out);
    }
  }
  if (opacity !== null) {
    push("/", "punctuation");
    push(opacity, "tw-modifier");
  }
  if (trailingBang) push("!", "tw-modifier");
}

/** Splits one class into variant / utility / value / modifier tokens; every character is kept. */
function pushClass(text: string, out: CodeToken[]) {
  if (!text) return;
  let depth = 0;
  let cursor = 0;
  for (let index = 0; index < text.length; index += 1) {
    const current = text[index];
    if (current === "[" || current === "(") depth += 1;
    else if (current === "]" || current === ")") depth = Math.max(0, depth - 1);
    else if (current === ":" && depth === 0) {
      out.push({ content: text.slice(cursor, index), role: "tw-variant" });
      out.push({ content: ":", role: "punctuation" });
      cursor = index + 1;
    }
  }
  pushUtility(text.slice(cursor), out);
}

/** Splits a whole class attribute value; whitespace runs stay plain so the line round-trips exactly. */
function pushClassString(text: string, out: CodeToken[]) {
  let index = 0;
  while (index < text.length) {
    if (/\s/.test(text[index])) {
      let end = index;
      while (end < text.length && /\s/.test(text[end])) end += 1;
      out.push({ content: text.slice(index, end), role: "plain" });
      index = end;
    } else {
      let end = index;
      while (end < text.length && !/\s/.test(text[end])) end += 1;
      pushClass(text.slice(index, end), out);
      index = end;
    }
  }
}

interface Part {
  content: string;
  role: CodeRole;
  scopes: string[];
}

const hasScope = (part: Part, prefixes: string[]) => part.scopes.some((scope) => matches(scope, prefixes));

/**
 * Walks the token stream with a little state: the attribute a string belongs
 * to, whether we are inside a class helper call, and where a tag ends. Strings
 * reached from `className`/`class` or a class helper become Tailwind roles.
 */
function classify(lines: Part[][]): CodeToken[][] {
  let attributeName: string | null = null;
  let classAttribute = false;
  const calls: boolean[] = [];
  let previous: Part | null = null;

  return lines.map((line) => {
    const out: CodeToken[] = [];
    for (const part of line) {
      const attribute = hasScope(part, ["entity.other.attribute-name"]);
      const round = hasScope(part, ["meta.brace.round"]);
      const tagEdge = hasScope(part, ["punctuation.definition.tag.begin", "punctuation.definition.tag.end"]);
      const delimiter = hasScope(part, ["punctuation.definition.string"]);

      if (attribute) {
        attributeName = part.content;
        classAttribute = attributeName === "className" || attributeName === "class";
      } else if (tagEdge) {
        attributeName = null;
        classAttribute = false;
      }

      if (round && part.content === "(") {
        calls.push(previous !== null && hasScope(previous, ["entity.name.function"]) && CLASS_FUNCTIONS.has(previous.content));
      } else if (round && part.content === ")") {
        calls.pop();
      }

      const classContext = classAttribute || calls.includes(true);
      if (classContext && part.role === "string" && !delimiter) {
        pushClassString(part.content, out);
      } else {
        out.push({ content: part.content, role: part.role });
      }

      if (part.content.trim()) previous = part;
    }
    return out;
  });
}

/** Splits `code` into lines of classified tokens at build time. Unknown languages come back as plain text. */
export async function highlight(code: string, lang: string): Promise<CodeToken[][]> {
  const language = LANG_ALIASES[lang] ?? lang;
  try {
    const lines = await codeToTokensBase(code, {
      lang: language,
      theme: "github-light",
      includeExplanation: "scopeName",
      // Shiki stops scoping a line after 500ms by default, so a busy build machine would silently drop colors; build time has no such budget.
      tokenizeTimeLimit: 0,
    });
    return classify(
      lines.map((line) =>
        line.flatMap((token) =>
          (token.explanation ?? [{ content: token.content, scopes: [] }]).map((part) => {
            const scopes = part.scopes.map((scope) => scope.scopeName);
            return { content: part.content, scopes, role: roleOf(scopes) };
          }),
        ),
      ),
    );
  } catch {
    return code.split("\n").map((line) => [{ content: line, role: "plain" as const }]);
  }
}
