import { useEffect, useState } from "react";
import { Animated, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ width = "100%", height = 16, radius, circle = false, style }: SkeletonProps) {
  const t = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[
        {
          width,
          height,
          borderRadius: circle ? height / 2 : (radius ?? t.radius.md),
          backgroundColor: t.colors.muted,
          opacity,
        },
        style,
      ]}
    />
  );
}
