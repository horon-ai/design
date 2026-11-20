import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { easing } from "../lib/motion";
import { HoronText } from "../lib/text";

/** Props for {@link UsageMeter}. */
export type UsageMeterProps = {
  /** What the meter measures, such as "Tasks used"; sits left of the percentage. */
  label: ReactNode;
  /** 0-100. */
  value: number;
  /** Left caption, such as "6,420 of 10,000 tasks". */
  detail?: ReactNode;
  /** Right caption, such as "Resets Nov 1". */
  note?: ReactNode;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. @default "solid" */
  surface?: "solid" | "glass";
  /** Layout for the meter root (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** `value` as a 0-100 percentage the track can paint; a non-finite value reports 0. */
function toPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** True for text the row can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Usage meter` (in Loading 109:733): a card with a 6px sky fill, solid or thick glass.
 *
 * React built this on Base UI `Meter`, which exposed the percentage and animated the fill width.
 * React Native has no meter primitive, so the same announcement comes from `role="progressbar"`
 * and `accessibilityValue`, and the fill eases to its width over 400ms on the quint curve. The
 * fill is the single sky-500 accent; the card caps at 300px wide. Reduce Motion sets the fill at
 * once.
 *
 * @example
 * ```tsx
 * import { UsageMeter } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <UsageMeter
 *       label="Tasks"
 *       value={64}
 *       detail="6,420 of 10,000 tasks"
 *       note="Resets Nov 1"
 *     />
 *   );
 * }
 * ```
 */
export function UsageMeter({ label, value, detail, note, surface = "solid", style }: UsageMeterProps) {
  const theme = useHoronTheme();
  const percent = toPercent(value);
  const [width] = useState(() => new Animated.Value(percent));

  useEffect(() => {
    if (theme.reducedMotion) {
      width.setValue(percent);
      return;
    }
    Animated.timing(width, {
      toValue: percent,
      duration: 400,
      easing: easing.outQuint,
      useNativeDriver: false,
    }).start();
  }, [percent, theme.reducedMotion, width]);

  return (
    <View
      accessible
      role="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percent) }}
      accessibilityLabel={isPlainText(label) ? String(label) : undefined}
      style={[
        styles.root,
        surface === "glass"
          ? { overflow: "hidden", borderRadius: radius.xl, borderCurve: "continuous" }
          : {
              borderWidth: 1,
              borderColor: theme.color("border-default"),
              backgroundColor: theme.color("bg-surface"),
              borderRadius: radius.xl,
              borderCurve: "continuous",
            },
        style,
      ]}
    >
      {surface === "glass" ? (
        <GlassSurface tier="thick" radius={radius.xl} style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={styles.row}>
        <View style={styles.label}>
          {isPlainText(label) ? <HoronText variant="label-md">{label}</HoronText> : label}
        </View>
        <HoronText variant="label-md" tone="text-secondary" style={styles.numbers}>
          {`${Math.round(percent)}%`}
        </HoronText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.color("overlay-ink-8") }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: primitives["sky-500"],
              width: width.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
            },
          ]}
        />
      </View>
      {detail || note ? (
        <View style={styles.row}>
          <View style={styles.label}>
            {isPlainText(detail) ? (
              <HoronText variant="caption" tone="text-secondary">
                {detail}
              </HoronText>
            ) : (
              detail
            )}
          </View>
          {note ? (
            isPlainText(note) ? (
              <HoronText variant="caption" tone="text-secondary" style={styles.nowrap}>
                {note}
              </HoronText>
            ) : (
              <View style={styles.nowrap}>{note}</View>
            )
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%", maxWidth: 300, minWidth: 0, gap: spacing["2"], padding: spacing["4"] },
  row: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  label: { flex: 1, minWidth: 0 },
  numbers: { fontVariant: ["tabular-nums"] },
  nowrap: { flexShrink: 0 },
  track: { height: 6, width: "100%", overflow: "hidden", borderRadius: radius.full },
  fill: { height: "100%", borderRadius: radius.full },
});
