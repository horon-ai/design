import { useMemo, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { HoronPressable } from "../lib/press";
import { GlassSurface } from "../lib/glass-surface";
import { useIconWeight } from "../lib/icon";
import { controlHeight, DISABLED_OPACITY, type ControlSize, touchSlop } from "../lib/size";

/**
 * Fill and text colour of an icon button:
 *
 * - `primary`: solid brand fill with the inverse icon, for the one main action in a cluster.
 * - `ghost` (default): no fill until press, primary icon; the common toolbar and row action.
 * - `glass`: the clear glass disc from `expo-glass-effect`, for floating chrome over imagery.
 * - `solid`: bordered raised surface, for a button that sits on the page background.
 * - `quiet`: no fill and no glass, secondary icon that turns primary while pressed; for dark
 *   shells and title bars where a glass disc would read as a grey bubble.
 */
export type IconButtonVariant = "primary" | "ghost" | "glass" | "solid" | "quiet";
/** Square footprint: `sm` 32pt, `md` 40pt, `lg` 48pt. */
export type IconButtonSize = ControlSize;

/** Props of {@link IconButton}: the treatment, the footprint and the glyph. */
export type IconButtonProps = {
  /** Treatment, from the list on `IconButtonVariant`. @default "ghost" */
  variant?: IconButtonVariant;
  /** Square footprint: `sm` 32pt, `md` 40pt, `lg` 48pt, with the icon at 16/20/24pt. @default "md" */
  size?: IconButtonSize;
  /** The glyph. It is sized by the button through `IconContext`, so pass a bare Phosphor icon. */
  icon: ReactNode;
  /** Accessible name; the button has no visible text, so this is what a screen reader announces. */
  label: string;
  /** Blocks interaction, dims the disc and announces it as disabled. @default false */
  disabled?: boolean;
  /** Runs when the disc is pressed; a disabled disc never runs it. */
  onPress?: () => void;
  /** The react call site's handler name; runs from `onPress`, so either may be passed. */
  onClick?: () => void;
  /** Outer layout, merged onto the disc. */
  style?: StyleProp<ViewStyle>;
};

type Paint = { fill?: ColorToken; pressed?: ColorToken; border?: ColorToken; ink: ColorToken; pressedInk?: ColorToken };

const PAINT: Record<Exclude<IconButtonVariant, "glass">, Paint> = {
  primary: { fill: "interactive-primary", pressed: "interactive-primary-pressed", ink: "interactive-on-primary" },
  ghost: { pressed: "overlay-ink-10", ink: "text-primary" },
  solid: { fill: "bg-surface", pressed: "interactive-secondary-hover", border: "border-default", ink: "text-primary" },
  quiet: { pressed: "overlay-ink-10", ink: "text-secondary", pressedInk: "text-primary" },
};

const ICON: Record<IconButtonSize, number> = { sm: 16, md: 20, lg: 24 };

/**
 * Figma `Icon button` (57:167): Primary, Ghost, Glass and Solid in three sizes, plus a fill-free `quiet` variant.
 *
 * A round, icon-only pressable. `label` is the accessible name, since nothing is
 * visible; the disc is 32/40/48pt while a 44pt touch target is kept around it
 * through `hitSlop`, so the paint never moves. `glass` draws an
 * `expo-glass-effect` disc on iOS 26 and the frost fallback elsewhere. A
 * disabled disc paints at 40% (the glyph alone for `glass`, since a native
 * glass view cannot fade with its parent) and ignores presses.
 *
 * @example
 * ```tsx
 * import { Gear, Plus } from "phosphor-react-native";
 * import { IconButton } from "@horon-ai/expo";
 *
 * function Actions() {
 *   return (
 *     <View style={{ flexDirection: "row", gap: 4 }}>
 *       <IconButton icon={<Plus />} label="New agent" variant="primary" />
 *       <IconButton icon={<Gear />} label="Settings" />
 *     </View>
 *   );
 * }
 * ```
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  icon,
  label,
  disabled = false,
  onPress,
  onClick,
  style,
}: IconButtonProps) {
  const theme = useHoronTheme();
  const disc = controlHeight[size];
  const paint = variant === "glass" ? undefined : PAINT[variant];
  const restInk = theme.color(disabled ? "text-disabled" : (paint?.ink ?? "text-primary"));
  const downInk = theme.color(disabled ? "text-disabled" : variant === "quiet" ? "text-primary" : (paint?.ink ?? "text-primary"));
  const iconWeight = useIconWeight();
  // Two prepared values instead of one object per press, so the provider never re-mounts its consumers.
  const iconContext = useMemo(
    () => ({
      rest: { color: restInk, size: ICON[size], weight: iconWeight },
      down: { color: downInk, size: ICON[size], weight: iconWeight },
    }),
    [downInk, restInk, size, iconWeight],
  );

  return (
    <HoronPressable
      haptic="light"
      pressScale
      role="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={touchSlop(theme.touch, disc, disc)}
      onPress={() => {
        onPress?.();
        onClick?.();
      }}
      style={({ pressed }) => [
        styles.root,
        // Glass is left unclipped so the native refraction rim at its edge stays visible.
        variant !== "glass" && styles.clip,
        { width: disc, height: disc },
        paint?.fill ? { backgroundColor: theme.color(paint.fill) } : null,
        paint?.border ? { borderWidth: 1, borderColor: theme.color(paint.border) } : null,
        !disabled && pressed && paint?.pressed ? { backgroundColor: theme.color(paint.pressed) } : null,
        disabled && variant !== "glass" ? { opacity: DISABLED_OPACITY } : null,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {variant === "glass" ? (
            <GlassSurface
              tier="clear"
              radius={radius.full}
              interactive={!disabled}
              pressed={pressed && !disabled}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={variant === "glass" && disabled ? { opacity: DISABLED_OPACITY } : styles.icon}>
            <IconContext.Provider value={pressed ? iconContext.down : iconContext.rest}>
              {icon}
            </IconContext.Provider>
          </View>
        </>
      )}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  clip: { overflow: "hidden" },
  icon: { alignItems: "center", justifyContent: "center" },
});
