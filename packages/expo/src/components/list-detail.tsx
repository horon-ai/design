import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { useMediaQuery } from "../hooks/use-media-query";
import { GlassSurface } from "../lib/glass-surface";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { HoronText } from "../lib/text";
import { Button } from "./button";
import { CodePanel, CodeKey } from "./code-panel";

/** One selectable row of a {@link ListDetail} list. */
export type ListDetailItem = {
  /** Stable identifier; it is the value the selection reports and the row key. */
  id: string;
  /** Row title, drawn in mono and truncated to one line. */
  title: ReactNode;
  /** Secondary line under the title, in secondary colour. */
  meta?: ReactNode;
};

/** A captioned group of {@link ListDetailItem} rows. */
export type ListDetailGroup = {
  /** Stable identifier used as the group's key. */
  id: string;
  /** Caption above the rows, in 11pt semibold secondary text. */
  label: ReactNode;
  /** Rows of this group, in display order. */
  items: ListDetailItem[];
};

/** Props for {@link ListDetail}: the groups and one render function for the selected item. */
export type ListDetailProps = {
  /** Groups rendered into the left list; the flat order also drives the selection fallback. */
  groups: ListDetailGroup[];
  /** Controlled selected id. Leave unset to let the component hold the selection itself. */
  value?: string;
  /** Initial selection when uncontrolled. Falls back to the first item of the first group. */
  defaultValue?: string;
  /** Fires with the new id whenever a row is pressed, controlled or not. */
  onValueChange?: (id: string) => void;
  /** Renders the detail pane for the selected item. */
  children: (item: ListDetailItem) => ReactNode;
  /** `solid` (default) is an opaque surface shell with a default border; `glass` is the thick glass shell. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, merged onto the shell. */
  style?: StyleProp<ViewStyle>;
};

/** True for text the shell can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** React's `sm` rung: below it the two panes stack instead of squeezing the detail pane. */
const STACK_QUERY = "(max-width: 639px)";

/**
 * Paper `List and detail` (1W6P-0): a 16pt-radius shell, solid or thick glass, with a 250pt list on an
 * inset surface and a detail pane. Selecting a row fills it and swaps the detail with a short rise.
 *
 * Selection is controlled or uncontrolled like a native input: pass `value` to own it, or
 * `defaultValue` for the initial row. Below the `sm` breakpoint the two panes stack instead of
 * shrinking the list. The list is `role="listbox"` whose rows are `role="option"` pressables with
 * the selected accessibility state, so a screen reader hears the same structure React announced.
 *
 * @example
 * ```tsx
 * <ListDetail
 *   groups={[
 *     {
 *       id: "sources",
 *       label: "Sources",
 *       items: [{ id: "readme", title: "README.md", meta: "2.1 KB" }],
 *     },
 *   ]}
 * >
 *   {(item) => (
 *     <>
 *       <ListDetailHeader title={item.title} description="Indexed 4 minutes ago" />
 *       <ListDetailMeta items={[{ id: "chunks", label: "Chunks", value: 42 }]} />
 *     </>
 *   )}
 * </ListDetail>
 * ```
 */
export function ListDetail({
  groups,
  value,
  defaultValue,
  onValueChange,
  children,
  surface = "solid",
  style,
}: ListDetailProps) {
  const theme = useHoronTheme();
  const all = groups.flatMap((group) => group.items);
  const [inner, setInner] = useState(defaultValue ?? all[0]?.id);
  const selectedId = value ?? inner;
  const selected = all.find((item) => item.id === selectedId) ?? all[0];
  const stacked = useMediaQuery(STACK_QUERY);

  return (
    <View style={[styles.shell, style]}>
      {surface === "glass" ? (
        <GlassSurface tier="thick" radius={radius["2xl"]} style={StyleSheet.absoluteFill} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: radius["2xl"],
              backgroundColor: theme.color("bg-surface"),
              borderColor: theme.color("border-default"),
              borderWidth: 1,
            },
          ]}
        />
      )}
      <View
        role="list"
        accessibilityLabel="Items"
        style={[
          styles.list,
          {
            gap: spacing["3"],
            padding: spacing["2.5"],
            width: stacked ? "100%" : 250,
            backgroundColor: surface === "glass" ? undefined : theme.color("bg-inset"),
            borderColor: theme.color("border-default"),
            borderBottomWidth: stacked ? 1 : 0,
            borderRightWidth: stacked ? 0 : 1,
          },
        ]}
      >
        {groups.map((group) => (
          <View key={group.id} style={{ gap: spacing["0.5"] }}>
            <View style={{ paddingHorizontal: spacing["3"], paddingVertical: spacing["1"] }}>
              {isPlainText(group.label) ? (
                <HoronText variant="label-sm" tone="text-secondary" style={styles.caption}>
                  {group.label}
                </HoronText>
              ) : (
                group.label
              )}
            </View>
            {group.items.map((item) => {
              const current = item.id === selected?.id;
              return (
                <HoronPressable
                  key={item.id}
                  haptic="selection"
                  role="option"
                  accessibilityState={{ selected: current }}
                  onPress={() => {
                    setInner(item.id);
                    onValueChange?.(item.id);
                  }}
                  style={styles.row}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.rowInner,
                        {
                          gap: spacing["1"],
                          paddingHorizontal: spacing["3"],
                          paddingVertical: spacing["2.5"],
                          borderRadius: radius.sm,
                          backgroundColor: current
                            ? theme.color(pressed ? "overlay-ink-8" : "overlay-ink-6")
                            : pressed
                              ? theme.color("overlay-ink-4")
                              : undefined,
                        },
                      ]}
                    >
                      <View style={[styles.rowTitle, { gap: spacing["2"] }]}>
                        {isPlainText(item.title) ? (
                          <HoronText variant="label-md" tone="text-primary" numberOfLines={1}
                            style={{ fontFamily: theme.fonts.mono }}>
                            {item.title}
                          </HoronText>
                        ) : (
                          item.title
                        )}
                      </View>
                      {item.meta ? (
                        isPlainText(item.meta) ? (
                          <HoronText variant="label-sm" tone="text-secondary">
                            {item.meta}
                          </HoronText>
                        ) : (
                          item.meta
                        )
                      ) : null}
                    </View>
                  )}
                </HoronPressable>
              );
            })}
          </View>
        ))}
      </View>
      <DetailPane key={selected?.id} reducedMotion={theme.reducedMotion}>
        {selected ? children(selected) : null}
      </DetailPane>
    </View>
  );
}

/** The detail pane: a short rise on the shared 200ms slide, or straight in under reduced motion. */
function DetailPane({ reducedMotion, children }: { reducedMotion: boolean; children: ReactNode }) {
  const [rise] = useState(() => new Animated.Value(reducedMotion ? 1 : 0));

  useEffect(() => {
    if (reducedMotion) {
      rise.setValue(1);
      return;
    }
    rise.setValue(0);
    Animated.timing(rise, {
      toValue: 1,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [reducedMotion, rise]);

  return (
    <Animated.View
      style={[
        styles.pane,
        {
          opacity: rise,
          transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Props for {@link ListDetailHeader}: a tile icon, title, description and a right-hand action cluster. */
export type ListDetailHeaderProps = {
  /** Glyph on the 40pt sky tile; the tile only renders when this is set. */
  icon?: ReactNode;
  /** Detail title, drawn in mono at `label-lg` semibold. */
  title: ReactNode;
  /** One line under the title, in body-sm secondary colour. */
  description?: ReactNode;
  /** Right-hand cluster: a state label, a `Switch`, an icon button. */
  actions?: ReactNode;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Detail header: a 40pt sky tile with a 20pt icon, title and description, actions on the right.
 *
 * React swapped the tile's sky tint with `dark:` variants; the scheme is read from the theme
 * here and the tile and its glyph take the matching pair.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailHeader({ icon, title, description, actions, style }: ListDetailHeaderProps) {
  const theme = useHoronTheme();
  const dark = theme.scheme === "dark";
  return (
    <View style={[styles.header, style]}>
      {icon ? (
        <View
          style={[
            styles.headerTile,
            {
              borderRadius: radius.sm,
              backgroundColor: primitives[dark ? "sky-900" : "sky-100"],
            },
          ]}
        >
          {icon}
        </View>
      ) : null}
      <View style={styles.headerCopy}>
        {isPlainText(title) ? (
          <HoronText
            variant="label-lg"
            tone="text-primary"
            style={{ fontFamily: theme.fonts.mono, fontWeight: "600" }}
          >
            {title}
          </HoronText>
        ) : (
          title
        )}
        {description ? (
          isPlainText(description) ? (
            <HoronText variant="body-sm" tone="text-secondary">
              {description}
            </HoronText>
          ) : (
            description
          )
        ) : null}
      </View>
      {actions ? <View style={styles.headerActions}>{actions}</View> : null}
    </View>
  );
}

/** One label/value pair of the meta box. */
type ListDetailMetaItem = {
  /** Stable identifier of the pair; its key. */
  id: string;
  /** Term above the value, in `label-sm` secondary text. */
  label: ReactNode;
  /** Definition under the label, truncated to one line. */
  value: ReactNode;
};

/** Props for {@link ListDetailMeta}: the label/value pairs of the meta box. */
export type ListDetailMetaProps = {
  /** Pairs rendered in a two-column grid, label over value. */
  items: ListDetailMetaItem[];
  /** Outer layout, merged onto the box. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Meta box: a subtle-fill 12pt-radius box with equal columns of a label over a 14/20 value.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailMeta({ items, style }: ListDetailMetaProps) {
  const theme = useHoronTheme();
  return (
    <View
      style={[
        styles.meta,
        {
          borderRadius: radius.md,
          backgroundColor: theme.color("bg-subtle"),
          paddingHorizontal: spacing["4"],
          paddingVertical: spacing["3.5"],
        },
        style,
      ]}
    >
      {items.map((item) => (
        <View key={item.id} style={styles.metaCell}>
          {isPlainText(item.label) ? (
            <HoronText variant="label-sm" tone="text-secondary">
              {item.label}
            </HoronText>
          ) : (
            item.label
          )}
          {isPlainText(item.value) ? (
            <HoronText variant="label-md" tone="text-primary" numberOfLines={1}>
              {item.value}
            </HoronText>
          ) : (
            item.value
          )}
        </View>
      ))}
    </View>
  );
}

/** Props for {@link ListDetailInstructions}: the block heading, the tag, the text and the edit callback. */
export type ListDetailInstructionsProps = {
  /** Heading above the panel.
   * @default "Instructions" */
  title?: ReactNode;
  /** Small chip beside the title, such as the file name. */
  tag?: ReactNode;
  /** Controlled draft. Leave unset to let the component hold it itself. */
  value?: string;
  /** Initial draft when uncontrolled.
   * @default "" */
  defaultValue?: string;
  /** Fires with the full text on every keystroke in edit mode. */
  onValueChange?: (value: string) => void;
  /** Outer layout, merged onto the wrapper. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Instructions block: header with an Edit button and a code panel. Edit opens a text input under
 * the panel with the 240ms collapse transition, and the frontmatter keys inside the `---` fences
 * paint in the syntax-key colour.
 *
 * React read the controlled `value` back into a textarea on each keystroke; this port keeps the
 * same controlled/uncontrolled contract and announces the input as "Edit instructions".
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailInstructions({
  title = "Instructions",
  tag,
  value,
  defaultValue = "",
  onValueChange,
  style,
}: ListDetailInstructionsProps) {
  const theme = useHoronTheme();
  const [inner, setInner] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [height, setHeight] = useState(0);
  const text = value ?? inner;
  const [expand] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      expand.setValue(editing ? 1 : 0);
      return;
    }
    Animated.timing(expand, {
      toValue: editing ? 1 : 0,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: false,
    }).start();
  }, [editing, theme.reducedMotion, expand]);

  return (
    <View style={[styles.instructions, style]}>
      <View style={styles.instructionsHead}>
        {typeof title === "string" || typeof title === "number" ? (
          <HoronText variant="label-md" tone="text-primary" style={styles.semibold}>
            {title}
          </HoronText>
        ) : (
          title
        )}
        {tag ? (
          <View style={[styles.tag, { backgroundColor: theme.color("overlay-ink-6") }]}>
            <HoronText variant="label-sm" tone="text-secondary">
              {tag}
            </HoronText>
          </View>
        ) : null}
        <View style={styles.spring} />
        <Button variant="solid" size="sm" aria-pressed={editing} onPress={() => setEditing((open) => !open)}>
          {editing ? "Done" : "Edit"}
        </Button>
      </View>
      <CodePanel>{highlightInstructions(text)}</CodePanel>
      <Animated.View
        style={[
          styles.collapse,
          { maxHeight: expand.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(height, 1)] }) },
        ]}
      >
        <TextInput
          accessibilityLabel="Edit instructions"
          accessibilityState={{ expanded: editing }}
          value={text}
          editable={editing}
          multiline
          onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
          onChangeText={(next) => {
            setInner(next);
            onValueChange?.(next);
          }}
          style={[
            styles.input,
            {
              borderRadius: radius.md,
              borderColor: theme.color("border-default"),
              backgroundColor: theme.color("bg-inset"),
              color: theme.color("text-primary"),
              ...theme.text("code"),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

/** Props for {@link ListDetailFiles}: the row label and the chips it wraps. */
export type ListDetailFilesProps = {
  /** Heading above the chips.
   * @default "Files" */
  label?: ReactNode;
  /** Chips, usually a small `Button` with an icon. */
  children: ReactNode;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Files row: a `label-md` heading over a wrap of 32pt chips, 6pt apart.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailFiles({ label = "Files", children, style }: ListDetailFilesProps) {
  return (
    <View style={[styles.files, style]}>
      {typeof label === "string" || typeof label === "number" ? (
        <HoronText variant="label-md" tone="text-primary" style={styles.semibold}>
          {label}
        </HoronText>
      ) : (
        label
      )}
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

/**
 * Footer: a 1pt top rule and 8pt-spaced glass buttons; pass a flex spacer as one child.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailFooter({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useHoronTheme();
  return (
    <View style={[styles.footer, { borderTopColor: theme.color("border-default") }, style]}>{children}</View>
  );
}

/**
 * Paints the frontmatter keys of the instructions block in the syntax-key colour, the way
 * react's `renderInstructions` highlighted every `key:` line between the `---` fences. React
 * nested `<span>`s; React Native can only colour a whole `Text`, so each line becomes one
 * `HoronText` and a matched key is its own segment.
 */
/** One rendered line of the instructions block, with the character offset it starts at. */
type InstructionLine = { offset: number; line: string };

/**
 * Splits the instructions into lines, each carrying its character offset, so a rendered line can
 * key on the text rather than on its position.
 */
function instructionLines(text: string): InstructionLine[] {
  const lines: InstructionLine[] = [];
  let offset = 0;
  for (const line of text.split("\n")) {
    lines.push({ offset, line });
    offset += line.length + 1;
  }
  return lines;
}

/** Renders the instructions once, painting the frontmatter keys in the syntax-key colour. */
function highlightInstructions(text: string): ReactNode {
  let fences = 0;
  const lines = instructionLines(text);
  return lines.map(({ offset, line }, index) => {
    if (line.trim() === "---") fences += 1;
    const match = fences === 1 ? /^([\w-]+:)(.*)$/.exec(line) : null;
    const tail = index < lines.length - 1 ? "\n" : "";
    return (
      <HoronText key={offset} variant="code" tone="syntax-string">
        {match ? (
          <>
            <CodeKey>{match[1]}</CodeKey>
            {match[2]}
          </>
        ) : (
          line
        )}
        {tail}
      </HoronText>
    );
  });
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: "column",
    width: "100%",
    maxWidth: 806,
    minWidth: 0,
    overflow: "hidden",
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
  },
  list: { flexDirection: "column", flexShrink: 0, borderStyle: "solid" },
  caption: { fontWeight: "600", letterSpacing: 0.4 },
  row: { width: "100%" },
  rowInner: { flexDirection: "column", width: "100%" },
  rowTitle: { flexDirection: "row", alignItems: "center" },
  pane: { flex: 1, minWidth: 0, flexDirection: "column", gap: spacing["5"], paddingHorizontal: spacing["6"], paddingVertical: 22 },
  header: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["3"] },
  headerTile: { width: 40, height: 40, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1, minWidth: 0, flexDirection: "column" },
  headerActions: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: spacing["3"] },
  meta: { flexDirection: "row", flexWrap: "wrap", columnGap: spacing["4"], rowGap: spacing["3"] },
  metaCell: { flexBasis: "45%", flexGrow: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  instructions: { flexDirection: "column", gap: spacing["2"] },
  instructionsHead: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  semibold: { fontWeight: "600" },
  tag: { flexDirection: "row", alignItems: "center", height: 22, borderRadius: radius.full, paddingHorizontal: spacing["2"] },
  spring: { flex: 1 },
  collapse: { overflow: "hidden" },
  input: {
    width: "100%",
    borderWidth: 1,
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3.5"],
    minHeight: 126,
    textAlignVertical: "top",
  },
  files: { flexDirection: "column", gap: spacing["2"] },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing["1.5"] },
  footer: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"], borderTopWidth: 1, paddingTop: spacing["3.5"] },
});
