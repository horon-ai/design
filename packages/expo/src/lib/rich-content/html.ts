import { parseDocument } from "htmlparser2";

import { headingLevel, safeHref, safeImageSrc, type RichBlock, type RichInline, type RichListItem, type RichTableAlign } from "./model";

/** The parts of an htmlparser2 node this file reads. */
type DomNode = {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: DomNode[];
  data?: string;
};

/**
 * Elements removed with everything inside them. Script and style elements already arrive as their
 * own node types and are never read; these are the remaining ones whose content is not prose.
 */
const DROPPED = new Set([
  "head", "title", "meta", "link", "base", "template", "noscript", "iframe", "frame", "frameset",
  "object", "embed", "applet", "svg", "math", "canvas", "audio", "video", "source", "track",
  "form", "input", "button", "select", "option", "textarea", "label", "fieldset", "dialog", "map",
]);

/** Elements that start a block; everything else that is not dropped is unwrapped into its text. */
const BLOCKS = new Set([
  "p", "div", "section", "article", "header", "footer", "main", "aside", "nav", "figure", "figcaption",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "ul", "ol", "li", "pre", "table", "hr", "dl", "dt", "dd",
]);

const element = (node: DomNode) => (node.type === "tag" ? (node.name ?? "").toLowerCase() : "");

function textContent(node: DomNode): string {
  if (node.type === "text") return node.data ?? "";
  if (node.type !== "tag" || DROPPED.has(element(node))) return "";
  if (element(node) === "br") return "\n";
  return (node.children ?? []).map(textContent).join("");
}

function inlines(nodes: DomNode[], pre = false): RichInline[] {
  return nodes.flatMap((node): RichInline[] => {
    if (node.type === "text") return [{ type: "text", text: pre ? (node.data ?? "") : (node.data ?? "").replace(/\s+/g, " ") }];
    const name = element(node);
    if (!name || DROPPED.has(name)) return [];
    const children = () => inlines(node.children ?? [], pre);
    switch (name) {
      case "br":
        return [{ type: "br" }];
      case "strong":
      case "b":
        return [{ type: "strong", children: children() }];
      case "em":
      case "i":
        return [{ type: "em", children: children() }];
      case "s":
      case "del":
      case "strike":
        return [{ type: "del", children: children() }];
      case "u":
      case "ins":
        return [{ type: "u", children: children() }];
      case "code":
      case "kbd":
      case "samp":
        return [{ type: "code", text: textContent(node) }];
      case "a": {
        const href = safeHref(node.attribs?.href);
        return href ? [{ type: "link", href, children: children() }] : children();
      }
      case "img":
        return [{ type: "image", src: safeImageSrc(node.attribs?.src), alt: node.attribs?.alt ?? "" }];
      default:
        return children();
    }
  });
}

const blank = (inline: RichInline | undefined) => inline?.type === "text" && inline.text.trim() === "";

/** Drops whitespace-only runs at the edges of a paragraph and trims the words next to them. */
function trimRun(run: RichInline[]): RichInline[] {
  const out = [...run];
  while (blank(out[0])) out.shift();
  while (blank(out.at(-1))) out.pop();
  const first = out[0];
  if (first?.type === "text") out[0] = { type: "text", text: first.text.trimStart() };
  const last = out.at(-1);
  if (last?.type === "text") out[out.length - 1] = { type: "text", text: last.text.trimEnd() };
  return out;
}

const elementsIn = (node: DomNode, names: string[]): DomNode[] =>
  (node.children ?? []).flatMap((child) =>
    names.includes(element(child)) ? [child] : child.type === "tag" && !DROPPED.has(element(child)) ? elementsIn(child, names) : [],
  );

function findCheckbox(node: DomNode): DomNode | undefined {
  for (const child of node.children ?? []) {
    if (element(child) === "input" && child.attribs?.type?.toLowerCase() === "checkbox") return child;
    if (child.type === "tag" && !["ul", "ol"].includes(element(child))) {
      const found = findCheckbox(child);
      if (found) return found;
    }
  }
  return undefined;
}

function listItem(node: DomNode): RichListItem {
  const box = findCheckbox(node);
  const children = blocks(node.children ?? []);
  return box ? { checked: box.attribs?.checked !== undefined, children } : { children };
}

function table(node: DomNode): RichBlock {
  const rows = elementsIn(node, ["tr"]);
  const cells = (row: DomNode) => elementsIn(row, ["th", "td"]);
  const first = rows[0];
  const headed = first !== undefined && cells(first).some((cell) => element(cell) === "th");
  const header = headed ? cells(first) : [];
  const body = headed ? rows.slice(1) : rows;
  const width = Math.max(header.length, ...body.map((row) => cells(row).length), 0);
  const align: RichTableAlign[] = Array.from({ length: width }, (_, index) => {
    const value = (header[index] ?? (body[0] ? cells(body[0])[index] : undefined))?.attribs?.align?.toLowerCase();
    return value === "left" || value === "center" || value === "right" ? value : null;
  });
  return {
    type: "table",
    align,
    header: header.map((cell) => trimRun(inlines(cell.children ?? []))),
    rows: body.map((row) => cells(row).map((cell) => trimRun(inlines(cell.children ?? [])))),
  };
}

function blocks(nodes: DomNode[]): RichBlock[] {
  const out: RichBlock[] = [];
  let run: RichInline[] = [];
  const flush = () => {
    const children = trimRun(run);
    if (children.length > 0) out.push({ type: "paragraph", children });
    run = [];
  };
  for (const node of nodes) {
    const name = element(node);
    if (!BLOCKS.has(name)) {
      run.push(...inlines([node]));
      continue;
    }
    flush();
    const children = node.children ?? [];
    switch (name) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        out.push({ type: "heading", level: headingLevel(Number(name[1])), children: trimRun(inlines(children)) });
        break;
      case "blockquote":
        out.push({ type: "blockquote", children: blocks(children) });
        break;
      case "ul":
      case "ol":
        out.push({
          type: "list",
          ordered: name === "ol",
          start: Number.parseInt(node.attribs?.start ?? "1", 10) || 1,
          items: elementsIn(node, ["li"]).map(listItem),
        });
        break;
      case "li":
        out.push({ type: "list", ordered: false, start: 1, items: [listItem(node)] });
        break;
      case "pre":
        out.push({ type: "code", text: textContent(node).replace(/\n$/, "") });
        break;
      case "table":
        out.push(table(node));
        break;
      case "hr":
        out.push({ type: "hr" });
        break;
      default:
        out.push(...blocks(children));
    }
  }
  flush();
  return out;
}

/**
 * Parses HTML into the document model through an allow list: only the elements above become
 * nodes, only `href` (vetted by `safeHref`), `src` (`https:` only), `alt`, `start`, `align`,
 * `type` and `checked` are read, and every other attribute (`on*` handlers, `style`, `class`,
 * `srcset`) is never looked at. `<script>`, `<style>` and the `DROPPED` elements vanish with
 * their content. While `streaming`, a tag that is still arriving at the end is cut off first.
 */
export function parseHtml(source: string, streaming = false): RichBlock[] {
  // The last `<` with no `>` after it is a tag still arriving; one lookup, not a regex that would
  // rescan from every `<` in a long reply.
  const last = source.lastIndexOf("<");
  const complete = streaming && last !== -1 && !source.includes(">", last) ? source.slice(0, last) : source;
  const document = parseDocument(complete, { decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true });
  // htmlparser2's node classes carry more than DomNode names; this file reads only those fields.
  const nodes: DomNode[] = document.children;
  return blocks(nodes);
}
