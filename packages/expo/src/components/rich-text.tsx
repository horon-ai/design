// Document nodes are identified by their position: a streamed reply only appends, so position
// keys keep every earlier block mounted while new text arrives.
/* oxlint-disable react/no-array-index-key */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { setStringAsync } from "expo-clipboard";
import { Check, CheckSquare, Copy, ImageSquare, Square } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type HoronTheme, type TextStyleName } from "../provider";
import { parseHtml } from "../lib/rich-content/html";
import { parseMarkdown, settleMarkdown } from "../lib/rich-content/markdown";
import { plainText, type RichBlock, type RichInline, type RichTableAlign } from "../lib/rich-content/model";
import { HoronPressable } from "../lib/press";
import { FIELD_MAX_FONT_SCALE } from "../lib/field-text";
import { HoronText } from "../lib/text";

/**
 * How {@link RichText} reads its source.
 *
 * - `text` — plain text; line breaks kept, nothing interpreted.
 * - `basic` — markdown limited to **bold**, *italic*, ~~strikethrough~~, ++underline++, `-` and
 *   `1.` lists, links, tables and code. Headings, quotes, rules, images and HTML show as the
 *   characters that were written.
 * - `markdown` — GFM: headings, quotes, lists and checklists, tables, code, rules, images, plus
 *   `++underline++`. Single newlines break the line, as chat replies expect.
 * - `html` — an allow list of HTML elements mapped onto the same blocks; scripts, styles,
 *   embeds, event handlers and unsafe links are removed before anything renders.
 */
export type RichTextFormat = "text" | "basic" | "markdown" | "html";
/** Body text rung: `sm` `body-sm`, `md` `body-md`, `lg` `body-lg`. Headings and tables follow it. */
export type RichTextSize = "sm" | "md" | "lg";
/**
 * Remote image policy. `block` (default) never fetches: an image shows as its alt text in a chip.
 * `load` fetches `https:` images only; `data:`, `file:` and `http:` sources stay blocked.
 */
export type RichTextImages = "block" | "load";

/** The words `RichText` adds on its own, for apps that render another language. */
export type RichTextLabels = {
  /** Copy button on a code block. @default "Copy" */
  copy?: string;
  /** The copy button after a successful copy. @default "Copied" */
  copied?: string;
  /** Spoken and shown for an image without alt text, and before blocked images' alt text. @default "Image" */
  image?: string;
  /** Title of the link confirmation. @default "Open this link?" */
  openLink?: string;
  /** Cancel button of the link confirmation. @default "Cancel" */
  cancel?: string;
  /** Confirm button of the link confirmation. @default "Open" */
  open?: string;
  /** Spoken for a checked checklist item. @default "Done" */
  checked?: string;
  /** Spoken for an unchecked checklist item. @default "Not done" */
  unchecked?: string;
};

/** Props of {@link RichText}. */
export type RichTextProps = {
  /** The source, in the chosen `format`. */
  children: string;
  /** How `children` is read. @default "text" */
  format?: RichTextFormat;
  /** Body text rung. @default "md" */
  size?: RichTextSize;
  /** Colour of body text. @default "text-primary" */
  tone?: ColorToken;
  /**
   * The source is still arriving (a streamed chat reply). Unfinished markdown is settled before it
   * renders: an open code fence is closed, table rows wait for their delimiter row, unclosed
   * emphasis is closed, and a half-received link shows its text; in HTML a half-received tag is
   * cut off. Leave it off for finished text. @default false
   */
  streaming?: boolean;
  /** Let people select and copy the text, block by block. @default false */
  selectable?: boolean;
  /** Remote image policy. @default "block" */
  images?: RichTextImages;
  /** Wrap long code lines instead of scrolling them sideways inside the block. @default false */
  wrapCode?: boolean;
  /** Show a copy button on code blocks. @default true */
  copyCode?: boolean;
  /**
   * Called with a link's target instead of opening it. Only `https`, `http`, `mailto` and `tel`
   * targets ever arrive here; any other link renders as plain text.
   */
  onLinkPress?: (href: string) => void;
  /** Ask before opening a link, showing its full target. Ignored when `onLinkPress` is set. @default false */
  confirmLinks?: boolean;
  /** The words the component adds on its own. */
  labels?: RichTextLabels;
  /** Outer layout. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const DEFAULT_LABELS: Required<RichTextLabels> = {
  copy: "Copy",
  copied: "Copied",
  image: "Image",
  openLink: "Open this link?",
  cancel: "Cancel",
  open: "Open",
  checked: "Done",
  unchecked: "Not done",
};

const BODY: Record<RichTextSize, TextStyleName> = { sm: "body-sm", md: "body-md", lg: "body-lg" };
const TABLE_BODY: Record<RichTextSize, TextStyleName> = { sm: "caption", md: "body-sm", lg: "body-sm" };
const TABLE_HEAD: Record<RichTextSize, TextStyleName> = { sm: "label-sm", md: "label-md", lg: "label-md" };
const HEADING: Record<number, TextStyleName> = { 1: "title-lg", 2: "title-md", 3: "title-sm", 4: "label-lg", 5: "label-lg", 6: "label-lg" };

/** Widest a table column grows at 1× text before its cells wrap; it scales with the OS text size. */
const COLUMN_MAX = 240;
const COLUMN_MIN = 48;

type Context = {
  theme: HoronTheme;
  body: TextStyleName;
  size: RichTextSize;
  tone: ColorToken;
  selectable: boolean;
  images: RichTextImages;
  wrapCode: boolean;
  copyCode: boolean;
  labels: Required<RichTextLabels>;
  scale: number;
  openLink: (href: string) => void;
};

/**
 * Renders plain text, a markdown subset, markdown or HTML with the kit's tokens, as native
 * `Text` and `View` (no WebView), so it works in Expo Go, development builds and on the web.
 *
 * All four formats parse into one document model, so the same content looks the same whatever
 * format it arrived in. Type comes from the `body-*`, `title-*`, `label-*` and `code` tokens in
 * Pretendard and Geist Mono, colours from the active scheme, and every text follows the OS text
 * size up to 2×.
 *
 * - **Safety**: HTML goes through an allow list (see {@link RichTextFormat}); links open only for
 *   `https`, `http`, `mailto` and `tel`, optionally after a confirmation; remote images load only
 *   with `images="load"` and only over `https`.
 * - **Long content**: long links and words wrap; code blocks scroll sideways inside the block
 *   (or wrap with `wrapCode`); a wide table scrolls sideways inside its own frame, so the page
 *   never moves. Table columns size to their content between 48pt and 240pt (scaled with the OS
 *   text size); longer cells wrap onto more lines, nothing is truncated.
 * - **Accessibility**: headings are headers, links are links inside their sentence, checklist
 *   marks announce their state, images read their alt text, and everything reads in source order.
 *
 * @example
 * ```tsx
 * <RichText format="markdown" streaming={!done} selectable confirmLinks>
 *   {reply}
 * </RichText>
 * ```
 */
export function RichText({
  children,
  format = "text",
  size = "md",
  tone = "text-primary",
  streaming = false,
  selectable = false,
  images = "block",
  wrapCode = false,
  copyCode = true,
  onLinkPress,
  confirmLinks = false,
  labels,
  style,
  testID,
}: RichTextProps) {
  const theme = useHoronTheme();
  const { fontScale } = useWindowDimensions();
  const words = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);

  const document = useMemo((): RichBlock[] => {
    switch (format) {
      case "markdown":
      case "basic":
        return parseMarkdown(streaming ? settleMarkdown(children) : children, format);
      case "html":
        return parseHtml(children, streaming);
      default:
        return children ? [{ type: "paragraph", children: [{ type: "text", text: children }] }] : [];
    }
  }, [children, format, streaming]);

  const context: Context = {
    theme,
    body: BODY[size],
    size,
    tone,
    selectable,
    images,
    wrapCode,
    copyCode,
    labels: words,
    scale: Math.min(Math.max(fontScale, 1), FIELD_MAX_FONT_SCALE),
    openLink: (href) => {
      if (onLinkPress) {
        onLinkPress(href);
        return;
      }
      const open = () => {
        Linking.openURL(href).catch(() => undefined);
      };
      if (!confirmLinks) open();
      else Alert.alert(words.openLink, href, [{ text: words.cancel, style: "cancel" }, { text: words.open, onPress: open }]);
    },
  };

  return (
    <View testID={testID} style={[styles.root, style]}>
      {renderBlocks(document, context, 0)}
    </View>
  );
}

function renderBlocks(blocks: RichBlock[], context: Context, depth: number): ReactNode[] {
  return blocks.map((block, index) => <BlockView key={`${block.type}-${index}`} block={block} context={context} depth={depth} />);
}

function BlockView({ block, context, depth }: { block: RichBlock; context: Context; depth: number }) {
  const { theme } = context;
  switch (block.type) {
    case "paragraph":
      return <Paragraph inlines={block.children} context={context} />;
    case "heading":
      return (
        <HoronText variant={HEADING[block.level] ?? "label-lg"} tone={context.tone} accessibilityRole="header" selectable={context.selectable}>
          {renderInlines(block.children, context, "h")}
        </HoronText>
      );
    case "blockquote":
      return (
        <View style={[styles.quote, { borderLeftColor: theme.color("border-strong") }]}>
          {renderBlocks(block.children, { ...context, tone: "text-secondary" }, depth)}
        </View>
      );
    case "list":
      return <List block={block} context={context} depth={depth} />;
    case "code":
      return <CodeBlock text={block.text} context={context} />;
    case "table":
      return <Table block={block} context={context} />;
    case "hr":
      return <View accessibilityRole="none" style={[styles.rule, { backgroundColor: theme.color("border-default") }]} />;
    default:
      return null;
  }
}

/** A paragraph; with `images="load"` its images break out into blocks between the text runs. */
function Paragraph({ inlines, context }: { inlines: RichInline[]; context: Context }) {
  const images = inlines.filter((inline): inline is Extract<RichInline, { type: "image" }> => inline.type === "image");
  if (images.length > 0 && images.length === inlines.filter((inline) => inline.type !== "text" || inline.text.trim()).length) {
    // An image on its own line: a block image when loading is allowed, else its alt text in a chip.
    return (
      <View style={styles.stack}>
        {images.map((image, index) =>
          context.images === "load" && image.src ? (
            <RemoteImage key={index} src={image.src} alt={image.alt} context={context} />
          ) : (
            <ImageChip key={index} alt={image.alt} context={context} />
          ),
        )}
      </View>
    );
  }
  const loadable = context.images === "load" && images.some((inline) => inline.src);
  if (!loadable) {
    return (
      <HoronText variant={context.body} tone={context.tone} selectable={context.selectable}>
        {renderInlines(inlines, context, "p")}
      </HoronText>
    );
  }
  const parts: ReactNode[] = [];
  let run: RichInline[] = [];
  const flush = () => {
    if (plainText(run).trim()) parts.push(<Paragraph key={`t${parts.length}`} inlines={run} context={{ ...context, images: "block" }} />);
    run = [];
  };
  for (const inline of inlines) {
    if (inline.type === "image" && inline.src) {
      flush();
      parts.push(<RemoteImage key={`i${parts.length}`} src={inline.src} alt={inline.alt} context={context} />);
    } else run.push(inline);
  }
  flush();
  return <View style={styles.stack}>{parts}</View>;
}

function renderInlines(inlines: RichInline[], context: Context, key: string): ReactNode[] {
  const { theme } = context;
  return inlines.map((inline, index): ReactNode => {
    const id = `${key}.${index}`;
    switch (inline.type) {
      case "text":
        return inline.text;
      case "br":
        return "\n";
      case "strong":
        return (
          <Text key={id} style={styles.strong}>
            {renderInlines(inline.children, context, id)}
          </Text>
        );
      case "em":
        return (
          <Text key={id} style={styles.em}>
            {renderInlines(inline.children, context, id)}
          </Text>
        );
      case "del":
        return (
          <Text key={id} style={styles.del}>
            {renderInlines(inline.children, context, id)}
          </Text>
        );
      case "u":
        return (
          <Text key={id} style={styles.u}>
            {renderInlines(inline.children, context, id)}
          </Text>
        );
      case "code":
        return (
          <Text
            key={id}
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: theme.text(context.body).fontSize * 0.9,
              backgroundColor: theme.color("bg-inset"),
            }}
          >
            {`\u2009${inline.text}\u2009`}
          </Text>
        );
      case "link":
        return (
          <Text
            key={id}
            accessibilityRole="link"
            accessibilityHint={inline.href}
            onPress={() => context.openLink(inline.href)}
            style={[styles.u, { color: theme.color("text-brand") }]}
          >
            {renderInlines(inline.children, context, id)}
          </Text>
        );
      case "image":
        return (
          <Text key={id} style={{ color: theme.color("text-secondary") }}>
            {`[${inline.alt || context.labels.image}]`}
          </Text>
        );
      default:
        return null;
    }
  });
}

function List({ block, context, depth }: { block: Extract<RichBlock, { type: "list" }>; context: Context; depth: number }) {
  const { theme } = context;
  const line = theme.text(context.body).lineHeight;
  return (
    <View style={styles.list}>
      {block.items.map((item, index) => {
        const mark =
          item.checked !== undefined ? (
            <View
              accessible
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
              accessibilityLabel={item.checked ? context.labels.checked : context.labels.unchecked}
            >
              {item.checked ? (
                <CheckSquare size={line * 0.8} weight="fill" color={theme.color("text-brand")} />
              ) : (
                <Square size={line * 0.8} color={theme.color("text-secondary")} />
              )}
            </View>
          ) : (
            <HoronText variant={context.body} tone="text-secondary">
              {block.ordered ? `${block.start + index}.` : depth % 2 === 0 ? "•" : "◦"}
            </HoronText>
          );
        return (
          <View key={index} style={styles.item}>
            <View style={[styles.mark, { minHeight: line * context.scale, minWidth: block.ordered ? line * 1.2 : line * 0.8 }]}>{mark}</View>
            <View style={styles.itemBody}>{renderBlocks(item.children, context, depth + 1)}</View>
          </View>
        );
      })}
    </View>
  );
}

function CodeBlock({ text, context }: { text: string; context: Context }) {
  const { theme } = context;
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  const code = (
    <HoronText variant="code" tone="text-primary" selectable={context.selectable}>
      {text}
    </HoronText>
  );
  return (
    <View style={[styles.code, { backgroundColor: theme.color("bg-inset") }]}>
      {context.copyCode ? (
        <View style={styles.codeBar}>
          <HoronPressable
            role="button"
            haptic="selection"
            accessibilityLabel={copied ? context.labels.copied : context.labels.copy}
            hitSlop={spacing["2"]}
            onPress={() => {
              setStringAsync(text)
                .then(() => {
                  setCopied(true);
                  return undefined;
                })
                .catch(() => undefined);
            }}
            style={styles.copy}
          >
            {copied ? <Check size={14} color={theme.color("text-secondary")} /> : <Copy size={14} color={theme.color("text-secondary")} />}
            <HoronText variant="label-sm" tone="text-secondary">
              {copied ? context.labels.copied : context.labels.copy}
            </HoronText>
          </HoronPressable>
        </View>
      ) : null}
      {context.wrapCode ? (
        <View style={styles.codeBody}>{code}</View>
      ) : (
        <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator contentContainerStyle={styles.codeBody}>
          {code}
        </ScrollView>
      )}
    </View>
  );
}

/** A width estimate for a cell: Hangul, CJK and full-width forms take 1em, other characters about 0.58em. */
function textWidth(text: string, fontSize: number): number {
  let em = 0;
  for (const char of text) em += /[\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/.test(char) ? 1 : 0.58;
  return em * fontSize;
}

function Table({ block, context }: { block: Extract<RichBlock, { type: "table" }>; context: Context }) {
  const { theme, scale } = context;
  const headStyle = TABLE_HEAD[context.size];
  const bodyStyle = TABLE_BODY[context.size];
  const columns = Math.max(block.header.length, ...block.rows.map((row) => row.length));
  const padding = spacing["2"];
  const widths = Array.from({ length: columns }, (_, column) => {
    const cells = [block.header[column], ...block.rows.map((row) => row[column])];
    const widest = Math.max(
      0,
      ...cells.map((cell, index) =>
        cell ? textWidth(plainText(cell), theme.text(index === 0 ? headStyle : bodyStyle).fontSize * scale) : 0,
      ),
    );
    return Math.ceil(Math.min(COLUMN_MAX * scale, Math.max(COLUMN_MIN, widest + padding * 2 + 2)));
  });
  const align = (index: number): TextStyle => ({ textAlign: alignOf(block.align[index]) });
  const row = (cells: RichInline[][], head: boolean, key: string) => (
    <View
      key={key}
      style={[
        styles.row,
        head && { backgroundColor: theme.color("bg-subtle"), borderBottomColor: theme.color("border-default"), borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      {widths.map((width, index) => (
        <View key={index} style={[styles.cell, { width, paddingHorizontal: padding }]}>
          <HoronText variant={head ? headStyle : bodyStyle} tone={head ? "text-primary" : context.tone} selectable={context.selectable} style={align(index)}>
            {renderInlines(cells[index] ?? [], context, `${key}.${index}`)}
          </HoronText>
        </View>
      ))}
    </View>
  );
  return (
    <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
      <View style={[styles.table, { borderColor: theme.color("border-default") }]}>
        {block.header.length > 0 ? row(block.header, true, "h") : null}
        {block.rows.map((cells, index) => row(cells, false, `r${index}`))}
      </View>
    </ScrollView>
  );
}

const alignOf = (align: RichTableAlign): TextStyle["textAlign"] => align ?? "left";

/** An `https:` image at the content width, keeping its own aspect ratio once it has loaded. */
function RemoteImage({ src, alt, context }: { src: string; alt: string; context: Context }) {
  const [ratio, setRatio] = useState(16 / 9);
  return (
    <Image
      source={{ uri: src }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={alt || context.labels.image}
      resizeMode="contain"
      onLoad={({ nativeEvent }) => {
        const { width, height } = nativeEvent.source;
        if (width > 0 && height > 0) setRatio(width / height);
      }}
      style={[styles.image, { aspectRatio: ratio, backgroundColor: context.theme.color("bg-inset") }]}
    />
  );
}

/** Shown for an image when remote loading is blocked: its alt text, never the image. */
function ImageChip({ alt, context }: { alt: string; context: Context }) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={alt || context.labels.image} style={styles.chip}>
      <ImageSquare size={16} color={context.theme.color("text-secondary")} />
      <HoronText variant="label-sm" tone="text-secondary">
        {alt || context.labels.image}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing["3"] },
  stack: { gap: spacing["2"] },
  strong: { fontWeight: "600" },
  em: { fontStyle: "italic" },
  del: { textDecorationLine: "line-through" },
  u: { textDecorationLine: "underline" },
  quote: { borderLeftWidth: 3, paddingLeft: spacing["3"], gap: spacing["2"] },
  rule: { height: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  list: { gap: spacing["1"] },
  item: { flexDirection: "row", gap: spacing["2"] },
  mark: { alignItems: "flex-end", justifyContent: "center", flexShrink: 0, alignSelf: "flex-start" },
  itemBody: { flex: 1, minWidth: 0, gap: spacing["1"] },
  code: { borderRadius: radius.md, borderCurve: "continuous", overflow: "hidden" },
  codeBar: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: spacing["3"], paddingTop: spacing["2"] },
  copy: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  codeBody: { paddingHorizontal: spacing["3"], paddingTop: spacing["1"], paddingBottom: spacing["3"] },
  tableScroll: { flexGrow: 0 },
  table: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.sm, overflow: "hidden" },
  row: { flexDirection: "row" },
  cell: { paddingVertical: spacing["1.5"] },
  image: { width: "100%", borderRadius: radius.md },
  chip: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
});
