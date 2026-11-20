import { useEffect, useState } from "react";
import { Animated, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";

/** Props for {@link Skeleton}: the shape and the layout that gives the placeholder its size. */
export type SkeletonProps = {
  /**
   * `block` has the Figma 6pt radius, `pill` is fully round (avatars, buttons).
   * @default "block"
   */
  shape?: "block" | "pill";
  /** Size and margins of the placeholder, such as `{ width: 160, height: 8 }`. */
  style?: StyleProp<ViewStyle>;
};

/** Props for {@link SkeletonCard}. */
export type SkeletonCardProps = {
  /**
   * Placeholder arrangement: `row` an avatar with two lines, `card` a heading,
   * three lines and a button, `text` three lines only.
   * @default "row"
   */
  type?: "row" | "card" | "text";
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is
   * the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Outer layout, merged onto the card. */
  style?: StyleProp<ViewStyle>;
};

/** A linear curve: both loops move at one constant speed, as react's CSS animations do. */
const linear = (value: number) => value;

/** One sweep of the highlight, the 1.6s linear `animate-shimmer` of react. */
const SHIMMER = 1600;

/**
 * A 7% ink placeholder; size it with `style`.
 *
 * The block is hidden from assistive technology and shimmers with a translucent
 * highlight, so it shows layout while content loads without being read out. The
 * highlight is a gradient wider than the block swept across it once every 1.6
 * seconds; with Reduce Motion on it stays a plain block.
 *
 * @example
 * ```tsx
 * import { Skeleton } from "@horon-ai/expo";
 *
 * function Row() {
 *   return (
 *     <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
 *       <Skeleton shape="pill" style={{ width: 36, height: 36 }} />
 *       <Skeleton style={{ width: 192, height: 12 }} />
 *     </View>
 *   );
 * }
 * ```
 */
export function Skeleton({ shape = "block", style }: SkeletonProps) {
  const theme = useHoronTheme();
  const [width, setWidth] = useState(0);
  const [sweep] = useState(() => new Animated.Value(0));
  const still = theme.reducedMotion;

  useEffect(() => {
    if (still || width === 0) {
      sweep.stopAnimation();
      sweep.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: SHIMMER, easing: linear, useNativeDriver: true }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [still, sweep, width]);

  const translateX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-width, width] });

  return (
    <View
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={[
        {
          backgroundColor: theme.color("overlay-ink-7"),
          borderRadius: shape === "pill" ? radius.full : radius.xs,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {width > 0 && !still ? (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: width * 2,
            opacity: theme.scheme === "dark" ? 0.06 : 0.4,
            backgroundImage: `linear-gradient(90deg, transparent 30%, ${theme.color("text-on-ink")} 50%, transparent 70%)`,
            transform: [{ translateX }],
          }}
        />
      ) : null}
    </View>
  );
}

/**
 * Figma `Skeleton` (in Loading 109:733): Row, Card and Text placeholders on a solid or thick-glass card.
 *
 * Use it while a list, a detail card or a paragraph loads. The card announces
 * itself once with `role="status"` and the label "Loading"; the individual bars
 * stay hidden from assistive technology. The glass surface is an
 * `expo-glass-effect` card on iOS 26 and the frost fallback elsewhere, the same
 * material react paints with `bg-glass-thick` plus its liquid layer.
 *
 * @example
 * ```tsx
 * import { SkeletonCard } from "@horon-ai/expo";
 *
 * function Loading() {
 *   return <SkeletonCard type="text" surface="glass" />;
 * }
 * ```
 */
export function SkeletonCard({ type = "row", surface = "solid", style }: SkeletonCardProps) {
  const theme = useHoronTheme();
  const rows = 300;
  const column = 280;
  const frame: ViewStyle = {
    position: "relative",
    gap: spacing["3"],
    borderRadius: radius.xl,
    padding: spacing["4"],
    overflow: "hidden",
    borderCurve: "continuous",
    width: type === "row" ? rows : column,
    maxWidth: "100%",
    flexDirection: type === "row" ? "row" : "column",
    alignItems: type === "row" ? "center" : "flex-start",
  };

  const content =
    type === "row" ? (
      <>
        <Skeleton shape="pill" style={{ width: 36, height: 36, flexShrink: 0 }} />
        <View style={{ minWidth: 0, flex: 1, gap: spacing["2"] }}>
          <Skeleton style={{ height: 10, width: 140, maxWidth: "100%" }} />
          <Skeleton style={{ height: 8, width: 200, maxWidth: "100%" }} />
        </View>
      </>
    ) : null;

  const card =
    type === "card" ? (
      <>
        <Skeleton style={{ height: 12, width: 120, maxWidth: "100%" }} />
        <Skeleton style={{ height: 8, width: 248, maxWidth: "100%" }} />
        <Skeleton style={{ height: 8, width: 220, maxWidth: "100%" }} />
        <Skeleton style={{ height: 8, width: 160, maxWidth: "100%" }} />
        <Skeleton shape="pill" style={{ height: 28, width: 80, maxWidth: "100%" }} />
      </>
    ) : null;

  const text =
    type === "text" ? (
      <>
        <Skeleton style={{ height: 8, width: 248, maxWidth: "100%" }} />
        <Skeleton style={{ height: 8, width: 236, maxWidth: "100%" }} />
        <Skeleton style={{ height: 8, width: 180, maxWidth: "100%" }} />
      </>
    ) : null;

  if (surface === "glass") {
    return (
      <GlassSurface
        tier="thick"
        radius={radius.xl}
        accessible
        role="status"
        accessibilityLabel="Loading"
        style={[frame, style]}
      >
        {content}
        {card}
        {text}
      </GlassSurface>
    );
  }

  return (
    <View
      accessible
      role="status"
      accessibilityLabel="Loading"
      style={[
        frame,
        { borderWidth: 1, borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      {content}
      {card}
      {text}
    </View>
  );
}
