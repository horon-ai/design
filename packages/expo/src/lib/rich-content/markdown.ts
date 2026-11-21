import { Marked, type Token, type Tokens, type TokenizerAndRendererExtension } from "marked";
import { decodeHTML } from "entities";

import { headingLevel, safeHref, safeImageSrc, type RichBlock, type RichInline, type RichListItem } from "./model";

/**
 * `++text++` underlines, the markdown-it-ins convention. CommonMark has no underline (`__x__` is
 * bold there), so the kit takes the one widespread extension that does not collide with it.
 */
const underline: TokenizerAndRendererExtension = {
  name: "underline",
  level: "inline",
  start(src) {
    const index = src.indexOf("++");
    return index === -1 ? undefined : index;
  },
  tokenizer(src) {
    const match = /^\+\+(?=\S)([\s\S]*?\S)\+\+(?!\+)/.exec(src);
    if (!match) return undefined;
    return { type: "underline", raw: match[0], text: match[1], tokens: this.lexer.inlineTokens(match[1] ?? "") };
  },
  renderer: () => "",
};

/** GFM with single newlines kept as line breaks, the way chat replies are written. */
const parser = new Marked({ gfm: true, breaks: true });
parser.use({ extensions: [underline] });

/** `markdown` renders everything below; `basic` keeps emphasis, lists, links, tables and code only. */
type Profile = "markdown" | "basic";

const text = (value: string): RichInline => ({ type: "text", text: decodeHTML(value) });

function inlines(tokens: Token[] | undefined, profile: Profile): RichInline[] {
  if (!tokens) return [];
  return tokens.flatMap((token): RichInline[] => {
    switch (token.type) {
      case "text":
        return "tokens" in token && token.tokens?.length ? inlines(token.tokens, profile) : [text(token.text)];
      case "escape":
        return [{ type: "text", text: token.text }];
      case "strong":
      case "em":
      case "del":
        return [{ type: token.type, children: inlines(token.tokens, profile) }];
      case "underline":
        return [{ type: "u", children: inlines(token.tokens, profile) }];
      case "codespan":
        return [{ type: "code", text: decodeHTML(token.text) }];
      case "br":
        return [{ type: "br" }];
      case "link": {
        const href = safeHref(token.href);
        const children = inlines(token.tokens, profile);
        return href ? [{ type: "link", href, children }] : children;
      }
      case "image":
        return profile === "markdown"
          ? [{ type: "image", src: safeImageSrc(token.href), alt: decodeHTML(token.text) }]
          : [{ type: "text", text: token.raw }];
      // Inline HTML is shown as the characters that were sent, never interpreted.
      default:
        return [{ type: "text", text: token.raw }];
    }
  });
}

/** A block the profile does not format, as the plain characters of its source. */
const literal = (raw: string): RichBlock => ({ type: "paragraph", children: [{ type: "text", text: raw.trimEnd() }] });

// marked types `Token` with a catch-all member, so a `type` check alone does not narrow it.
const isList = (token: Token): token is Tokens.List => token.type === "list";
const isTable = (token: Token): token is Tokens.Table => token.type === "table";

function listItem(item: Tokens.ListItem, profile: Profile): RichListItem {
  const rest = item.tokens.filter((token) => token.type !== "checkbox");
  const children = blocks(rest, profile);
  if (!item.task) return { children };
  if (profile === "markdown") return { checked: item.checked ?? false, children };
  // `basic` has no checklists: the box stays as the characters `[ ]` / `[x]`.
  const box: RichInline = { type: "text", text: item.checked ? "[x] " : "[ ] " };
  const [first, ...others] = children;
  return {
    children:
      first?.type === "paragraph"
        ? [{ type: "paragraph", children: [box, ...first.children] }, ...others]
        : [{ type: "paragraph", children: [box] }, ...children],
  };
}

function blocks(tokens: Token[], profile: Profile): RichBlock[] {
  return tokens.flatMap((token): RichBlock[] => {
    switch (token.type) {
      case "space":
      case "def":
        return [];
      case "paragraph":
        return [{ type: "paragraph", children: inlines(token.tokens, profile) }];
      case "text":
        return [{ type: "paragraph", children: "tokens" in token && token.tokens ? inlines(token.tokens, profile) : [text(token.text)] }];
      case "code":
        return [{ type: "code", text: token.text }];
      case "list":
        if (!isList(token)) return [literal(token.raw)];
        return [
          {
            type: "list",
            ordered: token.ordered,
            start: typeof token.start === "number" ? token.start : 1,
            items: token.items.map((item) => listItem(item, profile)),
          },
        ];
      case "table":
        if (!isTable(token)) return [literal(token.raw)];
        return [
          {
            type: "table",
            align: token.align,
            header: token.header.map((cell) => inlines(cell.tokens, profile)),
            rows: token.rows.map((row) => row.map((cell) => inlines(cell.tokens, profile))),
          },
        ];
      case "heading":
        return profile === "markdown"
          ? [{ type: "heading", level: headingLevel(token.depth), children: inlines(token.tokens, profile) }]
          : [literal(token.raw)];
      case "blockquote":
        return profile === "markdown" ? [{ type: "blockquote", children: blocks(token.tokens ?? [], profile) }] : [literal(token.raw)];
      case "hr":
        return profile === "markdown" ? [{ type: "hr" }] : [literal(token.raw)];
      default:
        return [literal(token.raw)];
    }
  });
}

/** Parses markdown (GFM plus `++underline++`) into the document model. */
export function parseMarkdown(source: string, profile: Profile): RichBlock[] {
  return blocks(parser.lexer(source), profile);
}

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const TABLE_ROW = /^\s*\|/;
const TABLE_DELIMITER = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

/** How many cells a table row has, ignoring the optional outer pipes. */
const columns = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").length;

/**
 * Makes a markdown reply that is still arriving render as it will once complete, without the
 * flashes a plain parse shows on every chunk:
 *
 * - an open code fence is closed, so the code block appears at once instead of as raw text;
 * - table rows that have no delimiter row yet are held back, so pipes never flash as text;
 * - in the last paragraph, an unclosed `` ` ``, `**`, `~~`, `++` or `*` is closed (or dropped when
 *   nothing follows it yet), and a link whose target is still arriving shows its text only.
 */
export function settleMarkdown(source: string): string {
  const lines = source.split("\n");
  let fence: { char: string; length: number } | null = null;
  for (const line of lines) {
    const marker = FENCE.exec(line)?.[1];
    if (!marker) continue;
    const char = marker[0] ?? "`";
    if (!fence) fence = { char, length: marker.length };
    else if (char === fence.char && marker.length >= fence.length && line.trim() === marker) fence = null;
  }
  if (fence) return `${source}\n${fence.char.repeat(fence.length)}`;

  let end = lines.length;
  while (end > 0 && TABLE_ROW.test(lines[end - 1] ?? "")) end -= 1;
  const tail = lines.slice(end);
  // A table renders once its delimiter row has as many columns as its header; until then the
  // rows would parse as a paragraph of pipes, so they wait.
  const delimiter = tail.findIndex((line) => TABLE_DELIMITER.test(line) && line.includes("-"));
  const header = tail[delimiter - 1];
  if (tail.length > 0 && (delimiter < 1 || header === undefined || columns(tail[delimiter] ?? "") !== columns(header)))
    lines.length = end;

  const settled = lines.join("\n");
  const paragraphStart = settled.lastIndexOf("\n\n") + 1;
  return settled.slice(0, paragraphStart) + settleInline(settled.slice(paragraphStart));
}

function settleInline(paragraph: string): string {
  let out = paragraph.replace(/\[([^\]\n]*)\]\([^)\s]*$/, "$1").replace(/\[([^\]\n]*)$/, "$1");
  if ((out.match(/`/g)?.length ?? 0) % 2 === 1) out = closeOrDrop(out, "`");
  const prose = out.replace(/`[^`]*`/g, "");
  const open: { marker: string; at: number }[] = [];
  for (const marker of ["**", "~~", "++"]) {
    if ((prose.split(marker).length - 1) % 2 === 1) open.push({ marker, at: prose.lastIndexOf(marker) });
  }
  const singles = prose.replace(/\*\*/g, "  ").replace(/^\s*\*\s/gm, "  ");
  if ((singles.match(/\*/g)?.length ?? 0) % 2 === 1) open.push({ marker: "*", at: singles.lastIndexOf("*") });
  // Close from the innermost (latest) opener outwards. An opener with nothing after it yet is
  // dropped instead, so a bare `**` never renders as a thematic break or as literal stars.
  const closers: string[] = [];
  // oxlint-disable-next-line unicorn/no-array-sort -- toSorted is ES2023 and not on every Hermes build; this sorts a fresh copy
  for (const { marker } of [...open].sort((a, b) => b.at - a.at)) {
    if (closers.length === 0 && out.trimEnd().endsWith(marker)) out = out.trimEnd().slice(0, -marker.length);
    else closers.push(marker);
  }
  return out + closers.join("");
}

/** Closes the last opener of `marker`, or removes it when nothing has arrived after it yet. */
function closeOrDrop(source: string, marker: string): string {
  const at = source.lastIndexOf(marker);
  return source.slice(at + marker.length).trim() === "" ? source.slice(0, at) + source.slice(at + marker.length) : source + marker;
}
