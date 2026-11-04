import { type BundledLanguage, codeToTokensBase } from "shiki";

/**
 * Code colors from the tokens (`--color-syntax-*`, plus secondary text for
 * comments so they stay readable). Shiki only classifies the source here; the
 * colors come from token utilities, so light and dark follow the theme without
 * a Shiki theme of our own.
 */
export type CodeTone = "plain" | "key" | "value" | "muted" | "comment";

export interface CodeToken {
  content: string;
  tone: CodeTone;
}

const KEY = [
  "keyword.control",
  "keyword.other",
  "storage",
  "entity.name.tag",
  "entity.name.function",
  "entity.name.type",
  "entity.other.attribute-name",
  "support.class",
  "support.function",
  "support.type",
  "variable.language",
];
const VALUE = ["string", "constant.numeric", "constant.language", "constant.character", "constant.other"];
const MUTED = ["comment", "punctuation", "keyword.operator", "meta.brace"];

const matches = (scope: string, prefixes: string[]) =>
  prefixes.some((prefix) => scope === prefix || scope.startsWith(`${prefix}.`));

/** Strings and comments win over their own quote or slash punctuation; otherwise the innermost scope decides. */
function toneOf(scopes: string[]): CodeTone {
  if (scopes.some((scope) => matches(scope, ["comment"]))) return "comment";
  if (scopes.some((scope) => matches(scope, ["string"]))) return "value";
  for (const scope of scopes.toReversed()) {
    if (matches(scope, VALUE)) return "value";
    if (matches(scope, KEY)) return "key";
    if (matches(scope, MUTED)) return "muted";
  }
  return "plain";
}

const LANG_ALIASES: Record<string, BundledLanguage> = { sh: "bash", shell: "bash", ts: "typescript", js: "javascript" };

/** Splits `code` into lines of colored tokens at build time. Unknown languages come back as plain text. */
export async function highlight(code: string, lang: string): Promise<CodeToken[][]> {
  const language = LANG_ALIASES[lang] ?? lang;
  try {
    const lines = await codeToTokensBase(code, {
      lang: language,
      theme: "github-light",
      includeExplanation: "scopeName",
    });
    return lines.map((line) =>
      line.flatMap((token) =>
        (token.explanation ?? [{ content: token.content, scopes: [] }]).map((part) => ({
          content: part.content,
          tone: toneOf(part.scopes.map((scope) => scope.scopeName)),
        })),
      ),
    );
  } catch {
    return code.split("\n").map((line) => [{ content: line, tone: "plain" as const }]);
  }
}
