import { useEffect, useState } from "react";
import { Animated, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { radius } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { easing } from "../lib/motion";

/** Props for {@link Progress}: the percentage, the range and the spoken value. */
export type ProgressProps = {
  /**
   * Determinate progress as a number inside `min`…`max`. Omit it (or pass
   * `null`) for the indeterminate bar, which sweeps a third-width bar across
   * the track.
   * @default null
   */
  value?: number | null;
  /** The low end of the range. @default 0 */
  min?: number;
  /** The high end of the range. @default 100 */
  max?: number;
  /**
   * Options for `Intl.NumberFormat` applied to the spoken value, for example
   * `{ style: "percent" }`; the default speaks the plain number.
   */
  format?: Intl.NumberFormatOptions;
  /** The locale `Intl.NumberFormat` uses for the spoken value; defaults to the runtime locale. */
  locale?: Intl.LocalesArgument;
  /** Builds the spoken value from the formatted number, replacing the default formatting. */
  getAriaValueText?: (formattedValue: string, value: number) => string;
  /** The spoken value, taking precedence over `format`, `locale` and `getAriaValueText`. */
  "aria-valuetext"?: string;
  /** Accessible name of the bar; the component has no visible label of its own. */
  "aria-label"?: string;
  /** Accessible name of the bar in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the 240pt root. */
  style?: StyleProp<ViewStyle>;
};

/** The 400ms growth of the fill when `value` changes, react's `duration-400`. */
const GROW = 400;

/** One sweep of the indeterminate bar, the 1.4s curve of react's `animate-sweep`. */
const SWEEP = 1400;

/**
 * Figma `Progress bar` (in Loading 109:733): a 6pt 8% ink track with an ink fill.
 *
 * The fill's width animates on a 400ms quint curve when `value` changes, so a
 * value fed from state reads as movement rather than a jump. Without a
 * `value` the bar becomes indeterminate: a third-width bar crosses the track
 * and re-enters every 1.4 seconds. The bar announces `role="progressbar"` with
 * its range and current value, or just the range while it is indeterminate.
 * With Reduce Motion on, the fill jumps to its width and the sweep rests at the
 * start of the track.
 *
 * @example
 * ```tsx
 * import { Progress } from "@horon-ai/expo";
 *
 * function Upload() {
 *   return (
 *     <View style={{ gap: 12 }}>
 *       <Progress value={64} aria-label="Upload" />
 *       <Progress aria-label="Loading" />
 *     </View>
 *   );
 * }
 * ```
 */
export function Progress({
  value = null,
  min = 0,
  max = 100,
  format,
  locale,
  getAriaValueText,
  "aria-valuetext": ariaValueText,
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: ProgressProps) {
  const theme = useHoronTheme();
  const [track, setTrack] = useState(0);
  const [fill] = useState(() => new Animated.Value(0));
  const [sweep] = useState(() => new Animated.Value(0));
  const indeterminate = value === null;
  const span = max - min;
  const percent = value === null || span <= 0 ? 0 : Math.min(100, Math.max(0, ((value - min) / span) * 100));
  const still = theme.reducedMotion;

  useEffect(() => {
    if (still) {
      fill.setValue(percent);
      return undefined;
    }
    const grow = Animated.timing(fill, {
      toValue: percent,
      duration: GROW,
      easing: easing.outQuint,
      useNativeDriver: false,
    });
    grow.start();
    return () => {
      grow.stop();
    };
  }, [fill, percent, still]);

  useEffect(() => {
    if (!indeterminate || still || track === 0) {
      sweep.stopAnimation();
      sweep.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: SWEEP, easing: easing.outQuint, useNativeDriver: true }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [indeterminate, still, sweep, track]);

  const formatted = value === null ? "" : new Intl.NumberFormat(locale, format).format(value);
  const spoken =
    ariaValueText ??
    (value === null
      ? undefined
      : (getAriaValueText?.(formatted, value) ?? (format === undefined && locale === undefined ? undefined : formatted)));
  const width = fill.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  const third = track / 3;
  const translateX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-third, track] });

  return (
    <View
      accessible
      role="progressbar"
      accessibilityLabel={accessibilityLabel ?? ariaLabel}
      accessibilityValue={
        value === null ? { min, max } : { min, max, now: Math.min(max, Math.max(min, value)), text: spoken }
      }
      onLayout={(event: LayoutChangeEvent) => setTrack(event.nativeEvent.layout.width)}
      style={[{ width: 240, maxWidth: "100%" }, style]}
    >
      <View style={[styles.track, { backgroundColor: theme.color("overlay-ink-8") }]}>
        {indeterminate ? (
          <Animated.View
            style={{
              height: "100%",
              width: third,
              borderRadius: radius.full,
              backgroundColor: theme.color("interactive-primary"),
              transform: [{ translateX }],
            }}
          />
        ) : (
          <Animated.View
            style={{
              height: "100%",
              borderRadius: radius.full,
              backgroundColor: theme.color("interactive-primary"),
              width,
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, width: "100%", borderRadius: radius.full, overflow: "hidden" },
});
