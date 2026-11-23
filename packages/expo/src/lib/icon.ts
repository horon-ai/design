import { useContext, useMemo } from "react";
import { IconContext, type IconProps, type IconWeight } from "phosphor-react-native";
import { icon } from "@horon-ai/tokens";

/** Default Phosphor weight matching `@horon-ai/tokens` `icon.strokeWidth.default` (1.3px on a 24px grid). */
export const DEFAULT_ICON_WEIGHT: IconWeight = icon.phosphorWeight.default;

/** Active/selected Phosphor weight matching `@horon-ai/tokens` `icon.strokeWidth.active` (1.8px on a 24px grid). */
export const ACTIVE_ICON_WEIGHT: IconWeight = icon.phosphorWeight.active;

/** Default SVG line-icon stroke width (1.3px on a 24px grid) from `@horon-ai/tokens`. */
export const DEFAULT_ICON_STROKE_WIDTH: number = icon.strokeWidth.default;

/** Active/selected SVG line-icon stroke width (1.8px on a 24px grid) from `@horon-ai/tokens`. */
export const ACTIVE_ICON_STROKE_WIDTH: number = icon.strokeWidth.active;

/** Reads the ambient Phosphor weight from `IconContext`, falling back to {@link DEFAULT_ICON_WEIGHT}. */
export function useIconWeight(): IconWeight {
  const { weight } = useContext(IconContext);
  return weight ?? DEFAULT_ICON_WEIGHT;
}

/**
 * Builds a nested `IconContext` value that inherits the ambient weight
 * (defaulting to {@link DEFAULT_ICON_WEIGHT}) instead of resetting it.
 */
export function useIconContext(overrides: Pick<IconProps, "color" | "size" | "weight">): IconProps {
  const parent = useContext(IconContext);
  const weight = overrides.weight ?? parent.weight ?? DEFAULT_ICON_WEIGHT;
  const { color, size } = overrides;
  return useMemo(() => ({ ...parent, color, size, weight }), [parent, color, size, weight]);
}
