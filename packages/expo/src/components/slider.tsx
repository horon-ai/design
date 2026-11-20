import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { radius } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { DISABLED_OPACITY } from "../lib/size";
import { useHaptic } from "../lib/press";

/** Above this many steps a slider reads as continuous, and a tick per step would buzz instead of count. */
const MAX_TICKED_STEPS = 100;

/** Props of {@link Slider}: Base UI's single-thumb range props plus the overrides below. */
export type SliderProps = {
  /** Value the caller owns; passing it makes the slider controlled. */
  value?: number;
  /** Value at first render when the caller does not own it. @default min */
  defaultValue?: number;
  /** Fires with the snapped value while the thumb moves and when the track is pressed. */
  onValueChange?: (value: number) => void;
  /** Fires with the snapped value once a drag or a track press ends. */
  onValueCommitted?: (value: number) => void;
  /** The low end of the range. @default 0 */
  min?: number;
  /** The high end of the range. @default 100 */
  max?: number;
  /** The granularity the value snaps to, measured from `min`. @default 1 */
  step?: number;
  /** Options for `Intl.NumberFormat` applied to the spoken value, for example `{ style: "percent" }`. */
  format?: Intl.NumberFormatOptions;
  /** The locale `Intl.NumberFormat` uses when the spoken value is formatted; defaults to the runtime locale. */
  locale?: Intl.LocalesArgument;
  /** Blocks interaction and dims the control. @default false */
  disabled?: boolean;
  /** The axis the thumb travels along. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /**
   * Where the thumb's own edges sit at the ends of the track. `center` puts the
   * thumb's centre on the end, so it overhangs by its radius; `edge` keeps the
   * whole thumb inside the track. `edge-client-only` behaves like `edge`, since
   * React Native renders on the client only.
   * @default "center"
   */
  thumbAlignment?: "center" | "edge" | "edge-client-only";
  /** Accessible name of the control, its only label. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the 220pt control. */
  style?: StyleProp<ViewStyle>;
};

/** The thumb's diameter, the Figma 18pt knob. */
const THUMB = 18;
/** The track's thickness. */
const TRACK = 6;
/** The length of the default control. */
const LENGTH = 220;
/** Half the thumb, the distance its centre sits from its own edge. */
const HALF = THUMB / 2;

/**
 * Snaps a raw value to the step grid and clamps it to the range. A zero or
 * negative step, or an inverted range, leaves the value where the clamp put it
 * instead of dividing by zero.
 */
function snap(raw: number, min: number, max: number, step: number): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const clamped = Math.min(high, Math.max(low, raw));
  if (!Number.isFinite(step) || step <= 0) return clamped;
  const stepped = low + Math.round((clamped - low) / step) * step;
  // Rounding lands on a floating-point neighbour of the grid (0.30000000000000004), so the
  // result is reduced to the step's own precision before it is reported.
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Math.min(high, Math.max(low, Number(stepped.toFixed(decimals))));
}

/**
 * Paper settings slider (Voice / Speed): a 20pt control, 6pt track at 8% ink with
 * an ink fill, and an 18pt thumb with a 1pt hairline and a 0 1 3 12% shadow.
 * Width comes from the caller.
 *
 * A touch anywhere on the control jumps the thumb there and keeps tracking the
 * finger until it lifts, which is how the whole row reads as draggable; a
 * vertical control grows upward, so the top of the column is `max`. The control
 * keeps a 44pt target around its 6pt track and a 20pt row, so a fingertip can
 * actually grab it. It announces `role="slider"` with its range and value, and
 * VoiceOver's increment and decrement actions step it by `step`. A disabled
 * slider dims to 40% and ignores touches.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Slider } from "@horon-ai/expo";
 *
 * function VoiceSpeed() {
 *   const [speed, setSpeed] = useState(1);
 *   return (
 *     <Slider
 *       aria-label="Voice speed"
 *       min={0.5}
 *       max={2}
 *       step={0.1}
 *       value={speed}
 *       onValueChange={setSpeed}
 *     />
 *   );
 * }
 * ```
 */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  format,
  locale,
  disabled = false,
  orientation = "horizontal",
  thumbAlignment = "center",
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: SliderProps) {
  const theme = useHoronTheme();
  const playHaptic = useHaptic();
  const [own, setOwn] = useState(defaultValue ?? min);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const current = snap(value ?? own, min, max, step);
  const vertical = orientation === "vertical";
  const measured = vertical ? box.height : box.width;
  const along = thumbAlignment === "center" ? measured : Math.max(0, measured - THUMB);
  const span = max - min;
  const share = span > 0 ? Math.min(1, Math.max(0, (current - min) / span)) : 0;
  const offset = share * along - (thumbAlignment === "center" ? HALF : 0);
  const fill = share * along + (thumbAlignment === "center" ? 0 : HALF);
  const spoken = format ? new Intl.NumberFormat(locale, format).format(current) : undefined;

  const applyAt = (position: number, done: boolean) => {
    if (disabled || measured <= 0) return;
    const local = vertical ? measured - position : position;
    const travel = along > 0 ? along : measured;
    const ratio = Math.min(1, Math.max(0, (local - (thumbAlignment === "center" ? 0 : HALF)) / travel));
    const next = snap(min + ratio * span, min, max, step);
    if (next !== current) {
      if (value === undefined) setOwn(next);
      if (span / step <= MAX_TICKED_STEPS) playHaptic("selection");
      onValueChange?.(next);
    }
    if (done) onValueCommitted?.(next);
  };

  const stepBy = (direction: 1 | -1) => {
    if (disabled) return;
    const next = snap(current + step * direction, min, max, step);
    if (next === current) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
    onValueCommitted?.(next);
  };

  return (
    <View
      style={[
        vertical ? { width: 30, height: LENGTH } : { width: LENGTH, maxWidth: "100%" },
        style,
      ]}
    >
      <View
        accessible
        role="slider"
        accessibilityLabel={accessibilityLabel ?? ariaLabel}
        accessibilityState={{ disabled }}
        accessibilityValue={{ min, max, now: current, text: spoken }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === "increment") stepBy(1);
          if (event.nativeEvent.actionName === "decrement") stepBy(-1);
        }}
        onLayout={(event: LayoutChangeEvent) => {
          const { width, height } = event.nativeEvent.layout;
          setBox((previous) => (previous.width === width && previous.height === height ? previous : { width, height }));
        }}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(event) => applyAt(vertical ? event.nativeEvent.locationY : event.nativeEvent.locationX, false)}
        onResponderMove={(event) => applyAt(vertical ? event.nativeEvent.locationY : event.nativeEvent.locationX, false)}
        onResponderRelease={() => onValueCommitted?.(current)}
        onResponderTerminate={() => onValueCommitted?.(current)}
        style={[
          styles.control,
          vertical
            ? { width: 30, height: LENGTH, flexDirection: "column", alignItems: "center", justifyContent: "center" }
            : { width: "100%", height: theme.touch ? 44 : 20 },
          disabled && { opacity: DISABLED_OPACITY },
        ]}
      >
        <View
          style={[
            styles.track,
            vertical ? { width: TRACK, height: "100%" } : { height: TRACK, width: "100%" },
            { backgroundColor: theme.color("overlay-ink-8") },
          ]}
        >
          <View
            style={[
              styles.fill,
              { backgroundColor: theme.color("interactive-primary") },
              vertical
                ? { position: "absolute", left: 0, bottom: 0, width: "100%", height: fill }
                : { position: "absolute", left: 0, top: 0, height: "100%", width: fill },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                borderColor: theme.color("border-default"),
                backgroundColor: theme.color("bg-default"),
                boxShadow: `0 1px 3px 0 ${theme.color("overlay-ink-12")}`,
              },
              vertical
                ? { left: (TRACK - THUMB) / 2, bottom: offset }
                : { top: (TRACK - THUMB) / 2, left: offset },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  control: { flexDirection: "row", alignItems: "center" },
  track: { position: "relative", borderRadius: radius.full },
  fill: { borderRadius: radius.full },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: radius.full,
    borderWidth: 1,
  },
});
