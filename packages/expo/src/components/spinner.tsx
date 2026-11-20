import { useEffect, useState } from "react";
import { Animated, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { useHoronTheme } from "../provider";

/**
 * Named spinner rungs, in 14/16/24/32pt (`xs`, `sm`, `md`, `lg`); a raw number is
 * also accepted for one-off sizes.
 */
export type SpinnerSize = "xs" | "sm" | "md" | "lg";

/** Props of {@link Spinner}: a rung or pixel size, the accessible label and the spinner's own layout. */
export type SpinnerProps = {
  /** Named size, or a pixel size for the one-off spinners in agent rows (12, 15, 20). @default "sm" */
  size?: SpinnerSize | number;
  /** Accessible name announced while spinning (`role="status"`). @default "Loading" */
  label?: string;
  /** Outer layout, merged onto the spinning box. */
  style?: StyleProp<ViewStyle>;
};

const RUNGS: Record<SpinnerSize, number> = { xs: 14, sm: 16, md: 24, lg: 32 };

/** A linear curve: both loops move at one constant speed, as react's CSS animations do. */
const linear = (value: number) => value;

/** One turn of the ring, the 1s linear loop `animate-spin` gives react. */
const TURN = 1000;

/**
 * Figma `Spinner` (Loading 109:733): a 10% ink ring with a quarter ink arc, 11% stroke.
 *
 * Sizes are fixed rungs (`xs` 14pt, `sm` 16pt, `md` 24pt, `lg` 32pt) or a raw
 * number; it never shrinks, spins for as long as it is mounted, and announces
 * `label` through `role="status"`. A one-second linear rotation of the whole
 * ring is what reads as motion, so the arc does not need to chase the value.
 * `HoronProvider reducedMotion` (or the OS Reduce Motion switch) parks the ring
 * instead of spinning it.
 *
 * @example
 * ```tsx
 * import { Spinner } from "@horon-ai/expo";
 *
 * function Saving() {
 *   return <Spinner size="sm" label="Saving" />;
 * }
 * ```
 */
export function Spinner({ size = "sm", label = "Loading", style }: SpinnerProps) {
  const theme = useHoronTheme();
  const pixels = typeof size === "number" ? size : RUNGS[size];
  const [turn] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      turn.stopAnimation();
      turn.setValue(0);
      return undefined;
    }
    const spin = Animated.loop(
      Animated.timing(turn, { toValue: 1, duration: TURN, easing: linear, useNativeDriver: true }),
    );
    spin.start();
    return () => {
      spin.stop();
    };
  }, [theme.reducedMotion, turn]);

  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <Animated.View
      accessible
      role="status"
      accessibilityLabel={label}
      style={[{ width: pixels, height: pixels, transform: [{ rotate }] }, style]}
    >
      <View style={{ width: pixels, height: pixels }}>
        <Svg viewBox="0 0 100 100" width={pixels} height={pixels}>
          <Circle
            cx="50"
            cy="50"
            r="44.5"
            fill="none"
            strokeWidth="11"
            stroke={theme.color("overlay-ink-10")}
          />
          <Path
            d="M50 5.5A44.5 44.5 0 0 1 94.5 50"
            fill="none"
            strokeWidth="11"
            stroke={theme.color("interactive-primary")}
          />
        </Svg>
      </View>
    </Animated.View>
  );
}
