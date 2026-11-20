import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { DISABLED_OPACITY, type ControlSize, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/** Shared control rungs plus `compact`, the 40x24 Paper bot-memory switch that keeps its own rung. */
export type SwitchSize = ControlSize | "compact";

/**
 * Props of {@link Switch}: the state props Base UI's switch root owned (`checked`,
 * `defaultChecked`, `onCheckedChange`, `disabled`, `readOnly`) plus the rung and
 * the optional inline label.
 */
export type SwitchProps = {
  /**
   * Active state the caller owns. Passing it makes the switch controlled: a tap
   * reports the next state through `onCheckedChange` but does not move the thumb.
   */
  checked?: boolean;
  /** Active state at first render when the caller does not own it. @default false */
  defaultChecked?: boolean;
  /** Fires with the next state when the switch is tapped. */
  onCheckedChange?: (checked: boolean) => void;
  /** Blocks interaction and dims the track. @default false */
  disabled?: boolean;
  /** Keeps the switch announced but refuses to toggle it. @default false */
  readOnly?: boolean;
  /** Track and thumb rung: `sm` 32x20, `md` 44x26, `lg` 52x30, `compact` 40x24. @default "md" */
  size?: SwitchSize;
  /** When set, the switch sits at the end of a label row and the whole row toggles it. */
  label?: ReactNode;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Accessible name of the track when there is no visible label. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the track (or onto the label row). */
  style?: StyleProp<ViewStyle>;
};

type Rung = {
  width: number;
  height: number;
  padding: number;
  thumb: number;
  gap: number;
  text: "body-sm" | "body-md" | "body-lg";
};

const RUNGS: Record<SwitchSize, Rung> = {
  sm: { width: 32, height: 20, padding: 2, thumb: 16, gap: spacing["3"], text: "body-sm" },
  md: { width: 44, height: 26, padding: 2, thumb: 22, gap: spacing["4"], text: "body-md" },
  lg: { width: 52, height: 30, padding: 2, thumb: 26, gap: spacing["4"], text: "body-lg" },
  compact: { width: 40, height: 24, padding: 3, thumb: 18, gap: spacing["3"], text: "body-sm" },
};

/**
 * Switch: MD 44x26 and SM 32x20 tracks with a white thumb 2pt in; LG is 52x30;
 * COMPACT 40x24 with an 18pt thumb 3pt in (Paper bot memory). The thumb stays
 * white on the grey track in both themes and takes the inverse of the ink fill
 * when checked, so the checked state reads the same in dark.
 *
 * A controlled `checked` keeps the caller in charge; otherwise the switch holds
 * its own state seeded by `defaultChecked`. The thumb springs across in 220ms on
 * the token spring curve while the track repaints, and Reduce Motion parks it at
 * its end position. It announces `role="switch"` with its checked and disabled
 * state. With `label` the row is the target, so the text beside the track
 * toggles it and becomes the accessible name.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Switch } from "@horon-ai/expo";
 *
 * function MemoryToggle() {
 *   const [remember, setRemember] = useState(true);
 *   return (
 *     <Switch
 *       label="Remember this bot's memory"
 *       size="compact"
 *       checked={remember}
 *       onCheckedChange={setRemember}
 *     />
 *   );
 * }
 * ```
 */
export function Switch({
  size = "md",
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  id,
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: SwitchProps) {
  const theme = useHoronTheme();
  const rung = RUNGS[size];
  const [own, setOwn] = useState(defaultChecked);
  const isChecked = checked ?? own;
  const travel = rung.width - rung.padding * 2 - rung.thumb;
  const [slide] = useState(() => new Animated.Value(isChecked ? travel : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      slide.setValue(isChecked ? travel : 0);
      return undefined;
    }
    const move = Animated.timing(slide, {
      toValue: isChecked ? travel : 0,
      duration: duration.popIn,
      easing: easing.spring,
      useNativeDriver: true,
    });
    move.start();
    return () => move.stop();
  }, [isChecked, slide, theme.reducedMotion, travel]);

  const toggle = () => {
    if (disabled || readOnly) return;
    const next = !isChecked;
    if (checked === undefined) setOwn(next);
    onCheckedChange?.(next);
  };

  return (
    <HoronPressable
      nativeID={id}
      haptic="selection"
      role="switch"
      accessibilityLabel={label === undefined ? (accessibilityLabel ?? ariaLabel) : undefined}
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      hitSlop={label === undefined ? touchSlop(theme.touch, rung.height, rung.width) : undefined}
      onPress={toggle}
      style={[label === undefined ? styles.trackHost : [styles.row, { gap: rung.gap }], disabled && { opacity: DISABLED_OPACITY }, style]}
    >
      {({ pressed }) => (
        <>
          {label === undefined ? null : (
            <HoronText variant={rung.text} style={styles.label}>
              {label}
            </HoronText>
          )}
          <View
            style={[
              styles.track,
              {
                width: rung.width,
                height: rung.height,
                padding: rung.padding,
                backgroundColor: theme.color(
                  pressed && !disabled
                    ? isChecked
                      ? "interactive-primary-hover"
                      : "interactive-secondary-hover"
                    : isChecked
                      ? "interactive-primary"
                      : "border-strong",
                ),
              },
            ]}
          >
            <Animated.View
              style={{
                width: rung.thumb,
                height: rung.thumb,
                borderRadius: radius.full,
                backgroundColor: theme.color(isChecked ? "interactive-on-primary" : "text-on-ink"),
                transform: [{ translateX: slide }],
              }}
            />
          </View>
        </>
      )}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  trackHost: { alignSelf: "flex-start" },
  row: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", maxWidth: "100%" },
  label: { flexShrink: 1, flexGrow: 1, minWidth: 0 },
  track: { flexShrink: 0, flexDirection: "row", alignItems: "center", borderRadius: radius.full },
});
