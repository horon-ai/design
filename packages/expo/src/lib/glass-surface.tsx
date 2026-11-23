import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { GlassView } from "expo-glass-effect";
import { glass, veil } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";

/** The three fills of the glass material, `glass-clear` to `glass-thick`. */
export type GlassTier = "clear" | "regular" | "thick";

/** Props of {@link GlassSurface}. */
export type GlassSurfaceProps = Omit<ViewProps, "style"> & {
  /**
   * Which tier fill the surface reads.
   * @default "regular"
   */
  tier?: GlassTier;
  /**
   * `glass` is the floating chrome material; `veil` is the lighter overlay
   * surface for menus, popups and dialogs (`@horon-ai/tokens` `veil`).
   * @default "glass"
   */
  material?: "glass" | "veil";
  /** Corner radius; the native effect clips to it. */
  radius?: number;
  /** Lets iOS react to touches on the glass (`GlassView isInteractive`). */
  interactive?: boolean;
  /**
   * The press state of the control drawn on this surface. Native glass reacts
   * on its own through `interactive`; the frost fallback has no system effect,
   * so it lays the `overlay-ink-8` wash over its fill while pressed (dark ink
   * on light, light ink on dark).
   */
  pressed?: boolean;
  /**
   * Layout of the surface. Keep `opacity` at 1: the native material is already
   * faded to `glass.native[scheme].fillOpacity`, and a faded parent fades it again.
   */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * The one glass material of `@horon-ai/tokens` `glass.ts`, drawn by
 * `expo-glass-effect`.
 *
 * - **native** (iOS 26+, Reduce Transparency off): a `GlassView` in
 *   `glass.native[scheme].effect` (`regular` for every tier, so scrolling text
 *   diffuses cleanly behind icons) laid behind the children at
 *   `glass.native[scheme].fillOpacity` (0.75 in light, 0.92 in dark) so the
 *   content behind shows through while dark curved specular refraction matches
 *   light and children stay opaque. `thick` adds the `glass-thick` tint
 *   (`glass-fill-strong` in dark) so the denser tier still reads denser. The
 *   `glass` material stays unclipped so the system refraction rim at the edge
 *   stays visible; `veil` clips its children to the corner. The view follows
 *   the theme scheme through `colorScheme`, so an in-app dark toggle wins over
 *   the system appearance.
 * - **frost** (Android, iOS before 26, Reduce Transparency, or
 *   `HoronProvider glass="frost"`): the backdrop cannot be filtered, so the
 *   fill becomes `glass-fill-frost` and the rim stays — a `rimWidth` ring
 *   whose top edge carries the bright stop, the sides the faint mid stop and
 *   the bottom the closing stop of the token gradient. `veil` adds the
 *   overlay ring and shadow instead of the rim.
 *
 * Elevation is not part of the material: a floating surface adds its own
 * `boxShadow` from `@horon-ai/tokens` `shadow`.
 */
export function GlassSurface({
  tier = "regular",
  material = "glass",
  radius = 0,
  interactive = false,
  pressed = false,
  style,
  children,
  ...rest
}: GlassSurfaceProps) {
  const theme = useHoronTheme();
  const shape: ViewStyle = radius
    ? { borderRadius: radius, borderCurve: "continuous" }
    : { borderCurve: "continuous" };

  if (theme.glass === "native") {
    const corners = cornerStyle(style);
    const nativeGlass = glass.native[theme.scheme];
    return (
      <View {...rest} style={[shape, material === "veil" && styles.clip, style]}>
        <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { opacity: nativeGlass.fillOpacity }]}>
          <GlassView
            glassEffectStyle={nativeGlass.effect}
            tintColor={
              tier === "thick"
                ? theme.color(theme.scheme === "dark" ? "glass-fill-strong" : "glass-thick")
                : undefined
            }
            colorScheme={theme.scheme}
            isInteractive={interactive}
            style={[StyleSheet.absoluteFill, shape, corners]}
          />
        </View>
        {children}
      </View>
    );
  }

  // The wash paints over the fill and under the children, so the pressed tint never covers a label.
  const ink = theme.color("overlay-ink-8");
  const wash: ViewStyle = pressed ? { backgroundImage: `linear-gradient(${ink}, ${ink})` } : {};
  const frost: ViewStyle =
    material === "veil"
      ? {
          backgroundColor: theme.color("glass-fill-frost"),
          ...wash,
          borderWidth: veil.ringWidth,
          borderColor: veil.scheme[theme.scheme].ring,
          boxShadow: `0 6px 24px 0 ${veil.scheme[theme.scheme].overlayShadow}`,
        }
      : {
          backgroundColor: theme.color("glass-fill-frost"),
          ...wash,
          borderWidth: glass.rimWidth,
          borderTopColor: glass.rim[theme.scheme].top,
          borderLeftColor: glass.rim[theme.scheme].mid,
          borderRightColor: glass.rim[theme.scheme].mid,
          borderBottomColor: glass.rim[theme.scheme].bottom,
        };

  return (
    <View {...rest} style={[shape, frost, style]}>
      {children}
    </View>
  );
}

const CORNER_KEYS = [
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderTopStartRadius",
  "borderTopEndRadius",
  "borderBottomStartRadius",
  "borderBottomEndRadius",
  "borderCurve",
] as const;

/** The corner keys of the caller's style, so the glass layer follows a radius set through `style`. */
function cornerStyle(style: StyleProp<ViewStyle>): ViewStyle | undefined {
  const flat = StyleSheet.flatten(style);
  if (!flat) return undefined;
  const corners: ViewStyle = {};
  let found = false;
  for (const key of CORNER_KEYS) {
    if (flat[key] === undefined) continue;
    Object.assign(corners, { [key]: flat[key] });
    found = true;
  }
  return found ? corners : undefined;
}

const styles = StyleSheet.create({
  clip: { overflow: "hidden" },
});
