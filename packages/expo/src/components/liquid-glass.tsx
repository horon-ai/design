import { StyleSheet } from "react-native";

import { GlassSurface, type GlassTier } from "../lib/glass-surface";

/** Props of {@link LiquidGlass}. */
export type LiquidGlassProps = {
  /**
   * Which `expo-glass-effect` style the layer asks for. React leaves the tier to
   * the host's CSS fill; a native `GlassView` has to be told, so the port takes
   * it here.
   * @default "regular"
   */
  tier?: GlassTier;
};

/**
 * The glass material from `@horon-ai/tokens` `glass.ts` as a layer: an
 * absolutely filled {@link GlassSurface} for the first child of a host that
 * clips (`overflow: "hidden"`) to its own radius. Content after it paints on top.
 *
 * On iOS 26 and later it is `expo-glass-effect`'s `GlassView`, so the host
 * should leave its own background transparent; elsewhere (Android, older iOS,
 * Reduce Transparency) it is the `glass-fill-frost` fill with the token rim.
 * Hidden from assistive technology and from touches, like react's
 * `aria-hidden` span.
 *
 * A component that owns its whole surface draws {@link GlassSurface} directly.
 *
 * @example
 * ```tsx
 * <View style={{ borderRadius: 20, overflow: "hidden", padding: 16 }}>
 *   <LiquidGlass />
 *   <HoronText>Floating chrome over the backdrop</HoronText>
 * </View>
 * ```
 */
export function LiquidGlass({ tier = "regular" }: LiquidGlassProps) {
  return (
    <GlassSurface
      tier={tier}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    />
  );
}
