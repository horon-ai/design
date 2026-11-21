/**
 * The one document model `RichText` draws. Markdown, the `basic` subset and HTML are all parsed
 * into it, so the four formats render the same content the same way, and nothing reaches the
 * screen that this model cannot express: there is no raw-HTML node, no style node and no script.
 */

/** A run of text inside a block. */
export type RichInline =
  | { type: "text"; text: string }
  | { type: "strong" | "em" | "del" | "u"; children: RichInline[] }
  | { type: "code"; text: string }
  /** `href` has already passed {@link safeHref}; an unsafe link is parsed as its plain text. */
  | { type: "link"; href: string; children: RichInline[] }
  /** `src` is empty when the source was not an `https:` URL; the renderer then shows `alt` only. */
  | { type: "image"; src: string; alt: string }
  | { type: "br" };

/** Column alignment of a table, from the markdown delimiter row or the HTML `align` attribute. */
export type RichTableAlign = "left" | "center" | "right" | null;

/** One list item; `checked` is set only on checklist items. */
export type RichListItem = { checked?: boolean; children: RichBlock[] };

/** A block of a document, in reading order. */
export type RichBlock =
  | { type: "paragraph"; children: RichInline[] }
  | { type: "heading"; level: RichHeadingLevel; children: RichInline[] }
  | { type: "blockquote"; children: RichBlock[] }
  | { type: "list"; ordered: boolean; start: number; items: RichListItem[] }
  /** The fence's language label is not kept: code renders the same whatever it names. */
  | { type: "code"; text: string }
  | { type: "table"; align: RichTableAlign[]; header: RichInline[][]; rows: RichInline[][][] }
  | { type: "hr" };

/** Heading depth, `h1` to `h6`. */
export type RichHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const LEVELS = [1, 2, 3, 4, 5, 6] as const;

/** Clamps a parsed heading depth into `1`–`6`. */
export function headingLevel(depth: number): RichHeadingLevel {
  return LEVELS[Math.min(5, Math.max(0, Math.round(depth) - 1))] ?? 6;
}

/** The link schemes `RichText` opens. Anything else is shown as plain text. */
export const LINK_SCHEMES = ["https", "http", "mailto", "tel"] as const;

/**
 * Returns the link target when it is an absolute URL with one of {@link LINK_SCHEMES}, else
 * `null`. Whitespace or control characters inside the value (`java\tscript:`) and relative or
 * scheme-less targets are refused, because there is no page to resolve them against.
 */
export function safeHref(raw: string | undefined): string | null {
  const href = raw?.trim();
  if (!href || /\s/.test(href) || hasControlCharacter(href)) return null;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(href)?.[1]?.toLowerCase();
  return scheme && (LINK_SCHEMES as readonly string[]).includes(scheme) ? href : null;
}

function hasControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

/** Returns an image source only when it is an `https:` URL; `data:`, `file:` and `http:` are refused. */
export function safeImageSrc(raw: string | undefined): string {
  const src = raw?.trim() ?? "";
  return /^https:\/\/[^\s]+$/i.test(src) ? src : "";
}

/** The words of a run, without formatting, for widths, labels and copies. */
export function plainText(inlines: RichInline[]): string {
  return inlines
    .map((inline) => {
      switch (inline.type) {
        case "text":
        case "code":
          return inline.text;
        case "br":
          return "\n";
        case "image":
          return inline.alt;
        default:
          return plainText(inline.children);
      }
    })
    .join("");
}
