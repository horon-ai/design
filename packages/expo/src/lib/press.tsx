import { useCallback, useEffect, useState } from "react";
import { Animated, Pressable, type GestureResponderEvent, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";

import { useHoronTheme } from "../provider";
import { duration, easing } from "./motion";

/**
 * The tap a press plays when the theme has haptics on.
 *
 * - `light`: a light impact, for buttons, rows and other actions.
 * - `selection`: the selection tick, for toggles, tabs, segments and pickers.
 * - `none`: silent, for surfaces that only scroll or open something passive.
 */
export type PressHaptic = "light" | "selection" | "none";

/** Props of {@link HoronPressable}. */
export type HoronPressableProps = PressableProps & {
  /**
   * The haptic played on press-in while `HoronProvider haptics` is on.
   * @default "light"
   */
  haptic?: PressHaptic;
  /**
   * Shrink to 97% while pressed, react's `motion-press`. Skipped under reduced motion.
   * @default false
   */
  pressScale?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Plays one haptic; a device without a Taptic Engine (or the web) just ignores it. */
function play(haptic: PressHaptic) {
  if (haptic === "none") return;
  const pending =
    haptic === "selection" ? Haptics.selectionAsync() : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  pending.catch(() => undefined);
}

/**
 * Haptics outside a press: a slider crossing a step, a drag snapping to a
 * value. The returned function plays `haptic` while `HoronProvider haptics` is
 * on and does nothing otherwise, so every haptic in the package follows the
 * same switch.
 */
export function useHaptic(): (haptic: PressHaptic) => void {
  const { haptics } = useHoronTheme();
  return useCallback(
    (haptic: PressHaptic) => {
      if (haptics) play(haptic);
    },
    [haptics],
  );
}

/**
 * The `Pressable` every Horon control is built on. It adds two things react
 * gets from CSS and the browser:
 *
 * - **haptics**: `expo-haptics` on press-in, switched as a whole by
 *   `HoronProvider haptics` (on by default) and per control by `haptic`.
 *   Nothing plays while the control is disabled.
 * - **press scale**: `pressScale` animates to 0.97 over 150ms on the native
 *   driver, the same curve as react's `motion-press`.
 *
 * Everything else is a plain `Pressable`: `role`, accessibility props,
 * `hitSlop`, the `({ pressed }) => …` style and children functions. The style
 * function is resolved here from the press state this component tracks itself,
 * because an `Animated` host flattens `style` and would drop a function.
 */
export function HoronPressable({
  haptic = "light",
  pressScale = false,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: HoronPressableProps) {
  const theme = useHoronTheme();
  const playHaptic = useHaptic();
  const [scale] = useState(() => new Animated.Value(1));
  const [pressed, setPressed] = useState(false);
  const animate = pressScale && !theme.reducedMotion;
  const resolved = typeof style === "function" ? style({ pressed }) : style;

  useEffect(() => {
    if (!animate) scale.setValue(1);
  }, [animate, scale]);

  const to = (value: number) =>
    Animated.timing(scale, {
      toValue: value,
      duration: duration.press,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(event: GestureResponderEvent) => {
        setPressed(true);
        if (!disabled) playHaptic(haptic);
        if (animate && !disabled) to(0.97);
        onPressIn?.(event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        setPressed(false);
        if (animate) to(1);
        onPressOut?.(event);
      }}
      style={animate ? [resolved, { transform: [{ scale }] }] : resolved}
    />
  );
}
