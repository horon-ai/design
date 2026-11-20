import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import type { ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/** Tint of the pill and its dot; `neutral` is the default.
 *
 * - `neutral`: 6% ink pill with secondary text, the default.
 * - `brand`: sky-tinted pill with brand text, for counts and states tied to the brand.
 * - `danger`: red-tinted pill with danger text, for errors and destructive states.
 * - `solid`: filled brand pill with on-primary text, for the strongest emphasis.
 * - `surface`: the raised surface pill with a 1px default border and primary text.
 */
export type BadgeTone = "neutral" | "brand" | "danger" | "solid" | "surface";
/** Size token shared with the form controls (`sm`, `md`, `lg`); the rendered heights are documented on {@link Badge}. */
export type BadgeSize = ControlSize;

/** Props for {@link Badge}: the tone, size, optional status dot and the pill's own layout. */
export type BadgeProps = {
  /** Colour treatment of the pill and its dot. @default "neutral" */
  tone?: BadgeTone;
  /** Leading status dot; 4pt (sm), 6pt (md) or 8pt (lg). */
  dot?: boolean;
  /** `md` is the 22pt Figma Badge; `sm` 20pt and `lg` 26pt. @default "md" */
  size?: BadgeSize;
  /** Outer layout, merged onto the pill (margins, alignment). */
  style?: StyleProp<ViewStyle>;
  /** The badge text. */
  children?: ReactNode;
};

type Paint = { fill: ColorToken; label: ColorToken; border?: ColorToken; dot: ColorToken };

const PAINT: Record<BadgeTone, Paint> = {
  neutral: { fill: "overlay-ink-6", label: "text-secondary", dot: "text-secondary" },
  brand: { fill: "accent-sky-500-18", label: "text-brand", dot: "status-live" },
  danger: { fill: "accent-red-500-14", label: "text-danger", dot: "text-danger" },
  solid: { fill: "interactive-primary", label: "interactive-on-primary", dot: "interactive-on-primary" },
  surface: { fill: "bg-surface", label: "text-primary", border: "border-default", dot: "text-primary" },
};

type Rung = {
  height: number;
  gap: number;
  padding: number;
  dot: number;
  text: "caption" | "label-sm" | "label-md";
};

const RUNGS: Record<BadgeSize, Rung> = {
  sm: { height: 20, gap: spacing["1"], padding: spacing["1.5"], dot: 4, text: "caption" },
  md: { height: 22, gap: spacing["1.5"], padding: spacing["2"], dot: 6, text: "label-sm" },
  lg: { height: 26, gap: spacing["1.5"], padding: spacing["2.5"], dot: 8, text: "label-md" },
};

/**
 * Figma `Badge` (61:283): a 22pt translucent pill with `label-sm` text on the
 * `md` rung, 20pt on `sm` and 26pt on `lg`.
 *
 * It is a plain `View`, so it can sit inside buttons, list rows and headings
 * without changing their layout height, and it is read as part of the sentence
 * around it rather than as a control of its own. The status dot is hidden from
 * assistive technology, like react's `aria-hidden` span.
 *
 * @example
 * ```tsx
 * import { Badge } from "@horon-ai/expo";
 *
 * function Status() {
 *   return (
 *     <Badge tone="brand" dot>
 *       Running
 *     </Badge>
 *   );
 * }
 * ```
 */
export function Badge({ tone = "neutral", dot, size = "md", style, children }: BadgeProps) {
  const theme = useHoronTheme();
  const rung = RUNGS[size];
  const paint = PAINT[tone];
  return (
    <View
      style={[
        styles.root,
        {
          height: rung.height,
          gap: rung.gap,
          paddingHorizontal: rung.padding,
          backgroundColor: theme.color(paint.fill),
          borderWidth: paint.border ? 1 : 0,
          borderColor: paint.border ? theme.color(paint.border) : undefined,
        },
        style,
      ]}
    >
      {dot ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ width: rung.dot, height: rung.dot, borderRadius: radius.full, backgroundColor: theme.color(paint.dot) }}
        />
      ) : null}
      <HoronText variant={rung.text} tone={paint.label} numberOfLines={1}>
        {children}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
});
