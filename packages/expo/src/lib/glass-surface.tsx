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
  /** Layout of the surface. Keep `opacity` at 1: Apple's glass does not render under a faded parent. */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * The one glass material of `@horon-ai/tokens` `glass.ts`, drawn by
 * `expo-glass-effect`.
 *
 * - **native** (iOS 26+, Reduce Transparency off): a `GlassView`. `clear` maps
 *   to the `clear` effect, `regular` and `thick` to `regular`; `thick` adds the
 *   `glass-thick` tint so the denser tier still reads denser. The view follows
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
  const shape = { borderRadius: radius, borderCurve: "continuous" } as const;

  if (theme.glass === "native") {
    return (
      <GlassView
        {...rest}
        glassEffectStyle={tier === "clear" && material === "glass" ? "clear" : "regular"}
        tintColor={tier === "thick" ? theme.color("glass-thick") : undefined}
        colorScheme={theme.scheme}
        isInteractive={interactive}
        style={[shape, styles.clip, style]}
      >
        {children}
      </GlassView>
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

const styles = StyleSheet.create({ clip: { overflow: "hidden" } });
