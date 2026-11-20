import { Platform } from "react-native";
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";

/**
 * Whether `expo-glass-effect`'s `GlassView` draws real Liquid Glass here.
 *
 * `GlassView` exists on iOS 26 and later only; elsewhere it renders a plain
 * `View`. `isLiquidGlassAvailable()` checks the OS, the SDK the app was built
 * with and `UIDesignRequiresCompatibility`; `isGlassEffectAPIAvailable()`
 * guards the iOS 26 betas whose API is missing at runtime (expo/expo#40911).
 * Either check throwing — an old binary without the native module — reads as
 * unavailable, so the caller paints the frost fallback instead of crashing.
 *
 * Reduce Transparency is not part of this answer: the provider combines the two.
 */
export function nativeGlassAvailable(): boolean {
  if (Platform.OS !== "ios") return false;
  try {
    return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}
