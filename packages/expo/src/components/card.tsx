import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretRight } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { HoronPressable } from "../lib/press";
import { HoronText } from "../lib/text";

/** Props of {@link Card}. */
export type CardProps = {
  /** Card heading on the title row, wrapping inside the card instead of truncating; the caret joins this row. */
  title?: ReactNode;
  /** Body line under the title, in body-sm secondary text. */
  description?: ReactNode;
  /** Shows the trailing caret, for cards that open something. */
  interactive?: boolean;
  /** Brand rim for the selected card. */
  selected?: boolean;
  /**
   * Called when the card is pressed. React swapped the root element through a
   * `render` prop (`<button />`, `<a />`); React Native has no element swapping,
   * so the card stays a pressable view and the handler arrives here instead.
   */
  onPress?: () => void;
  /**
   * `solid` (default) is an opaque surface with a default border. `glass` is the thick glass.
   * `frost` is the Paper home board card: the same glass with the denser frost fill and a 0 8 24 6% drop.
   * @default "solid"
   */
  surface?: "glass" | "frost" | "solid";
  /** Layout merged onto the card (width, margins). */
  style?: StyleProp<ViewStyle>;
  /** Content under the description, in a full-width block. */
  children?: ReactNode;
};

/** True for text the card can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Card` (63:310): a 320px thick-glass card, 20px padding and radius, Default / Interactive / Selected.
 *
 * `interactive` adds the caret and the 0.99 press scale, `selected` the brand rim, and children
 * render in a full-width block under the description. `glass` is a `GlassSurface`, so iOS 26
 * paints Liquid Glass and every other device the frost fallback; `frost` paints the denser frost
 * fill with the Figma 6% ink drop. Hover and focus rings have no touch equivalent and are
 * dropped; pass `onPress` for the tap path React got from its `render` element.
 *
 * @example
 * ```tsx
 * import { Card } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <Card
 *       interactive
 *       surface="frost"
 *       title="Weekly digest"
 *       description="A summary of everything the assistant saved this week."
 *       onPress={open}
 *     />
 *   );
 * }
 * ```
 */
export function Card({
  title,
  description,
  interactive,
  selected,
  onPress,
  surface = "solid",
  style,
  children,
}: CardProps) {
  const theme = useHoronTheme();

  const frame: ViewStyle = { borderRadius: radius.xl, borderCurve: "continuous" };
  const paint: ViewStyle =
    surface === "solid"
      ? {
          ...frame,
          borderWidth: 1,
          borderColor: theme.color(selected ? "border-brand" : "border-default"),
          backgroundColor: theme.color("bg-surface"),
        }
      : surface === "frost"
        ? {
            ...frame,
            borderWidth: selected ? 1 : 0,
            borderColor: theme.color("border-brand"),
            backgroundColor: theme.color("glass-fill-frost"),
            boxShadow: shadow.popover,
          }
        : {
            ...frame,
            borderWidth: selected ? 1 : 0,
            borderColor: theme.color("border-brand"),
            overflow: "hidden",
          };

  return (
    <HoronPressable
      disabled={!onPress}
      onPress={onPress}
      role={onPress ? "button" : undefined}
      style={({ pressed }) => [styles.root, paint, pressed && interactive && styles.pressed, style]}
    >
      {({ pressed }) => (
        <>
          {surface === "glass" ? (
            <GlassSurface
              tier="thick"
              radius={radius.xl}
              interactive={onPress !== undefined}
              pressed={pressed}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={styles.content}>
            {title ? (
              <View style={styles.titleRow}>
                <View style={styles.titleSlot}>
                  {isPlainText(title) ? (
                    <HoronText variant="title-sm" tone="text-primary">
                      {title}
                    </HoronText>
                  ) : (
                    title
                  )}
                </View>
                {interactive ? <CaretRight size={16} color={theme.color("text-secondary")} /> : null}
              </View>
            ) : null}
            {interactive && !title ? (
              <View style={styles.caret}>
                <CaretRight size={16} color={theme.color("text-secondary")} />
              </View>
            ) : null}
            {description ? (
              isPlainText(description) ? (
                <HoronText variant="body-sm" tone="text-secondary">
                  {description}
                </HoronText>
              ) : (
                description
              )
            ) : null}
            {children ? <View style={styles.body}>{children}</View> : null}
          </View>
        </>
      )}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: spacing["5"],
    minWidth: 0,
  },
  content: { gap: spacing["2"], alignSelf: "stretch" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing["2"], alignSelf: "stretch" },
  titleSlot: { flex: 1, minWidth: 0 },
  caret: { position: "absolute", top: 0, right: 0 },
  body: { alignSelf: "stretch" },
  pressed: { transform: [{ scale: 0.99 }] },
});
