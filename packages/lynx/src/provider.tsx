import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "@lynx-js/react";
import { darkColors, lightColors } from "@horon-ai/tokens";

/** The two schemes the theme root can paint. */
export type ColorScheme = "light" | "dark";

/** The typography board the root selects, mirroring react's `data-platform`. */
export type ThemePlatform = "desktop" | "mobile" | "web";

/** A colour token name, such as `text-primary` or `glass-regular`. */
export type ColorToken = keyof typeof lightColors;

/** What {@link useHoronTheme} returns: the active scheme, platform, motion flag and hex lookup. */
export type HoronTheme = {
  /** The scheme the root paints. `system` resolves to `light` until a host reports otherwise. */
  scheme: ColorScheme;
  /** The typography board the root selected. */
  platform: ThemePlatform;
  /** True while the root draws without motion. */
  reducedMotion: boolean;
  /** Resolves a token name to the hex of the active scheme. */
  color: (token: ColorToken) => string;
};

/** Props of {@link HoronProvider}: the root state plus the children it wraps. */
export type HoronProviderProps = {
  /**
   * Which palette to paint. `system` follows the host's own report when there is
   * one (the gallery passes it in `globalProps`), and `light` otherwise.
   * @default "light"
   */
  scheme?: ColorScheme | "system";
  /**
   * Which typography board to use.
   * @default "web"
   */
  platform?: ThemePlatform;
  /**
   * Draw without motion. Lynx cannot read `prefers-reduced-motion`, so the host
   * decides; the root class `.horon-reduced-motion` collapses every duration.
   * @default false
   */
  reducedMotion?: boolean;
  /** The tree to paint inside the theme root. */
  children?: ReactNode;
};

const DEFAULT_THEME: HoronTheme = {
  scheme: "light",
  platform: "web",
  reducedMotion: false,
  color: (token) => lightColors[token],
};

const ThemeContext = createContext<HoronTheme>(DEFAULT_THEME);

/**
 * The active theme values. Components use it for anything CSS cannot express —
 * an `<Icon>`'s SVG fill, a computed gradient — while everything else reads the
 * same tokens through Tailwind classes and CSS variables.
 */
export const useHoronTheme = (): HoronTheme => useContext(ThemeContext);

/** Reads the host's scheme hint from `globalProps`, when the gallery passes one. */
const hostScheme = (): ColorScheme => (typeof lynx !== "undefined" && lynx.__globalProps?.scheme === "dark" ? "dark" : "light");

/**
 * The root of every Horon Lynx tree: it paints the palette, selects the
 * typography board and publishes the theme to {@link useHoronTheme}.
 *
 * It renders a full-size `<view>` whose classes are the ones `tokens.css`
 * declares — `.horon-light` or `.dark` for the palette and
 * `.horon-platform-web|desktop|mobile` for the type board — plus
 * `.horon-reduced-motion` when motion is off. Lynx has no `<html>` to carry a
 * class and no media queries, so every switch is an ancestor class here, which is
 * also why the whole tree re-renders when a switch changes.
 *
 * `scheme="system"` resolves once at mount from `lynx.__globalProps.scheme`
 * (there is no OS preference API on Lynx); a host that wants to follow a live OS
 * change passes a resolved `"light"`/`"dark"` and updates it itself.
 *
 * @example
 * ```tsx
 * import { HoronProvider, Button } from "@horon-ai/lynx";
 *
 * function App() {
 *   return (
 *     <HoronProvider scheme="dark" platform="mobile">
 *       <Button>Continue</Button>
 *     </HoronProvider>
 *   );
 * }
 * ```
 */
export function HoronProvider({ scheme = "light", platform = "web", reducedMotion = false, children }: HoronProviderProps) {
  const [resolved, setResolved] = useState<ColorScheme>(scheme === "system" ? "light" : scheme);

  useEffect(() => {
    if (scheme !== "system") {
      setResolved(scheme);
      return;
    }
    setResolved(hostScheme());
  }, [scheme]);

  const theme = useMemo<HoronTheme>(
    () => ({
      scheme: resolved,
      platform,
      reducedMotion,
      color: (token) => (resolved === "dark" ? darkColors[token] : lightColors[token]),
    }),
    [resolved, platform, reducedMotion],
  );

  const rootClass = [
    "flex",
    "flex-col",
    "w-full",
    "h-full",
    resolved === "dark" ? "dark" : "horon-light",
    `horon-platform-${platform}`,
    reducedMotion ? "horon-reduced-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ThemeContext.Provider value={theme}>
      <view className={rootClass} style={{ width: "100%", height: "100%" }}>
        {children}
      </view>
    </ThemeContext.Provider>
  );
}
