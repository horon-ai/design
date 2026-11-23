import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AccessibilityInfo, StyleSheet, useColorScheme as useSystemColorScheme, View } from "react-native";
import { IconContext } from "phosphor-react-native";
import { darkColors, fontFamily, fontWeight, lightColors, textStyles, type ColorToken } from "@horon-ai/tokens";

import { nativeGlassAvailable } from "./lib/glass-support";

export type { ColorToken };

/** The two schemes the theme root can paint. */
export type ColorScheme = "light" | "dark";

/** The typography board the root selects, mirroring react's `data-platform`. */
export type ThemePlatform = "desktop" | "mobile" | "web";

/** One of the thirteen type styles in `@horon-ai/tokens` `typography.ts`. */
export type TextStyleName = keyof typeof textStyles;

/**
 * How the glass tiers paint.
 *
 * - `native`: iOS 26 Liquid Glass through `expo-glass-effect`'s `GlassView`.
 * - `frost`: the `glass-fill-frost` fill with the token rim, which is what
 *   `@horon-ai/tokens` `glass.ts` prescribes wherever the backdrop cannot be
 *   filtered — Android, iOS before 26, and Reduce Transparency.
 */
export type GlassMode = "native" | "frost";

/** The resolved React Native text style of one type token. */
export type ThemeTextStyle = {
  fontFamily: string;
  fontWeight: 400 | 500 | 600 | 700;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

/** What {@link useHoronTheme} returns: the active scheme, board, accessibility state and token lookups. */
export type HoronTheme = {
  /** The scheme the root paints. */
  scheme: ColorScheme;
  /** The typography board the root selected. */
  platform: ThemePlatform;
  /** True while the OS (or the host) asks for no motion. */
  reducedMotion: boolean;
  /** True while the OS asks for Reduce Transparency; glass paints `frost` then. */
  reduceTransparency: boolean;
  /** True while pressable controls keep a 44px hit target. */
  touch: boolean;
  /** True while presses play `expo-haptics` feedback. */
  haptics: boolean;
  /** How the glass tiers paint on this device. */
  glass: GlassMode;
  /** The family names the components draw with. */
  fonts: { sans: string; mono: string };
  /** Every colour token of the active scheme. */
  colors: Readonly<Record<ColorToken, string>>;
  /** Resolves a token name to the colour of the active scheme. */
  color: (token: ColorToken) => string;
  /** Resolves a type token to a React Native text style on the active board. */
  text: (style: TextStyleName) => ThemeTextStyle;
};

/** Props of {@link HoronProvider}: the root state plus the children it wraps. */
export type HoronProviderProps = {
  /**
   * Which palette to paint. `system` follows `useColorScheme()` live.
   * @default "system"
   */
  scheme?: ColorScheme | "system";
  /**
   * Which typography board to use. Phones and tablets read the Mobile column.
   * @default "mobile"
   */
  platform?: ThemePlatform;
  /**
   * Draw without motion. `undefined` follows the OS Reduce Motion setting.
   */
  reducedMotion?: boolean;
  /**
   * Keep a 44px hit target around every pressable control. The paint keeps its
   * own size; only the `hitSlop` grows.
   * @default true
   */
  touch?: boolean;
  /**
   * Play a light haptic on every press (a selection tick on toggles, tabs and
   * pickers) through `expo-haptics`. Turn it off for the whole tree here.
   * @default true
   */
  haptics?: boolean;
  /**
   * `auto` paints native Liquid Glass where `expo-glass-effect` reports it and
   * the frost fallback elsewhere; `frost` forces the fallback everywhere.
   * @default "auto"
   */
  glass?: "auto" | "frost";
  /**
   * The family names the app registered with `expo-font`. Defaults to the
   * first family of each `@horon-ai/tokens` stack.
   */
  fonts?: { sans?: string; mono?: string };
  /** The tree to paint inside the theme root. */
  children?: ReactNode;
};

const DEFAULT_FONTS = { sans: fontFamily.sans[0], mono: fontFamily.mono[0] };

/** Builds the theme value; also the default when no provider is mounted. */
function buildTheme(
  scheme: ColorScheme,
  platform: ThemePlatform,
  reducedMotion: boolean,
  reduceTransparency: boolean,
  touch: boolean,
  haptics: boolean,
  glass: GlassMode,
  fonts: { sans: string; mono: string },
): HoronTheme {
  const colors = scheme === "dark" ? darkColors : lightColors;
  const cache = new Map<TextStyleName, ThemeTextStyle>();
  return {
    scheme,
    platform,
    reducedMotion,
    reduceTransparency,
    touch,
    haptics,
    glass,
    fonts,
    colors,
    color: (token) => colors[token],
    text: (name) => {
      const hit = cache.get(name);
      if (hit) return hit;
      const style = textStyles[name];
      const size = style.size[platform];
      const resolved: ThemeTextStyle = {
        fontFamily: fonts[style.family],
        fontWeight: fontWeight[style.weight],
        fontSize: size,
        lineHeight: style.lineHeight[platform],
        // Tracking is em in the token file; React Native takes points.
        letterSpacing: Math.round(style.tracking * size * 100) / 100,
      };
      cache.set(name, resolved);
      return resolved;
    },
  };
}

const ThemeContext = createContext<HoronTheme>(
  buildTheme("light", "mobile", false, false, true, true, "frost", DEFAULT_FONTS),
);

/** The active theme values. Every component reads its colours, type and glass mode from here. */
export const useHoronTheme = (): HoronTheme => useContext(ThemeContext);

/** Follows one boolean AccessibilityInfo setting and its change event. */
function useAccessibilityFlag(
  read: () => Promise<boolean>,
  event: "reduceMotionChanged" | "reduceTransparencyChanged",
): boolean {
  const [value, setValue] = useState(false);
  useEffect(() => {
    let live = true;
    read()
      .then((enabled) => {
        if (live) setValue(enabled);
        return enabled;
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener?.(event, (enabled: boolean) => setValue(enabled));
    return () => {
      live = false;
      subscription?.remove();
    };
  }, [read, event]);
  return value;
}

const readReduceMotion = () => AccessibilityInfo.isReduceMotionEnabled?.() ?? Promise.resolve(false);
// React Native Web does not implement `isReduceTransparencyEnabled`.
const readReduceTransparency = () => AccessibilityInfo.isReduceTransparencyEnabled?.() ?? Promise.resolve(false);

/**
 * The root of every Horon Expo tree: it paints the palette background, selects
 * the typography board, follows Reduce Motion and Reduce Transparency, and
 * publishes the theme to {@link useHoronTheme}.
 *
 * Safe areas come from `react-native-safe-area-context`: mount its
 * `SafeAreaProvider` (Expo Router already does) above this root, and the edge
 * components (`TopBar`, `TabBar`, `BottomSheet`, `Toaster`, `Sidebar`, `Modal`)
 * pad themselves by the insets of the edge they sit on.
 *
 * @example
 * ```tsx
 * import { SafeAreaProvider } from "react-native-safe-area-context";
 * import { HoronProvider, Button } from "@horon-ai/expo";
 *
 * export default function App() {
 *   return (
 *     <SafeAreaProvider>
 *       <HoronProvider>
 *         <Button>Continue</Button>
 *       </HoronProvider>
 *     </SafeAreaProvider>
 *   );
 * }
 * ```
 */
export function HoronProvider({
  scheme = "system",
  platform = "mobile",
  reducedMotion,
  touch = true,
  haptics = true,
  glass = "auto",
  fonts,
  children,
}: HoronProviderProps) {
  const system = useSystemColorScheme();
  const resolved: ColorScheme = scheme === "system" ? (system === "dark" ? "dark" : "light") : scheme;
  const osReduceMotion = useAccessibilityFlag(readReduceMotion, "reduceMotionChanged");
  const reduceTransparency = useAccessibilityFlag(readReduceTransparency, "reduceTransparencyChanged");
  const motionOff = reducedMotion ?? osReduceMotion;
  const glassMode: GlassMode = glass === "auto" && !reduceTransparency && nativeGlassAvailable() ? "native" : "frost";
  const sans = fonts?.sans ?? DEFAULT_FONTS.sans;
  const mono = fonts?.mono ?? DEFAULT_FONTS.mono;

  const theme = useMemo(
    () => buildTheme(resolved, platform, motionOff, reduceTransparency, touch, haptics, glassMode, { sans, mono }),
    [resolved, platform, motionOff, reduceTransparency, touch, haptics, glassMode, sans, mono],
  );
  const iconDefaults = useMemo(() => ({ color: theme.color("text-primary"), size: 16 }), [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <IconContext.Provider value={iconDefaults}>
        <View style={[styles.root, { backgroundColor: theme.color("bg-default") }]}>{children}</View>
      </IconContext.Provider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
