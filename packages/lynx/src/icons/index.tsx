import { useMemo } from "@lynx-js/react";

import { cn } from "../lib/cn";
import { useHoronTheme, type ColorToken } from "../provider";
import { PHOSPHOR, type IconName, type IconWeight } from "./phosphor.g";

/** A raw hex colour, the other half of {@link IconColor}. */
type HexColor = `#${string}`;

/** The colour of an icon: a Horon colour token name, or a raw hex string. */
export type IconColor = ColorToken | HexColor;

/** Props of {@link Icon}: which glyph, at which size and tint. */
export type IconProps = {
  /** The phosphor component name, without the `Icon` suffix (`CaretDown`, `MagnifyingGlass`). */
  name: IconName;
  /**
   * Square size in CSS px. Components pass 12-24, matching the token scale.
   * @default 16
   */
  size?: number;
  /**
   * The weight the React source draws this icon with.
   * @default "regular"
   */
  weight?: IconWeight;
  /**
   * A Horon colour token (`text-primary`, `text-secondary`, `interactive-on-primary`) or a
   * raw hex value. Tokens resolve through the active scheme.
   * @default "text-primary"
   */
  color?: IconColor;
  /** Extra classes for the wrapper; the glyph fills the wrapper. */
  className?: string;
};

const isHexColor = (value: string): value is HexColor => value.startsWith("#");

/**
 * One phosphor glyph, painted through Lynx's `<svg content={string}>`.
 *
 * Lynx renders SVG as a single native view parsed from a string, and an SVG string
 * cannot read CSS variables, so the colour is substituted in the source instead of
 * inherited: a token name resolves to the hex of the active scheme through
 * {@link useHoronTheme}, a hex string is used as-is. That substitution is why the
 * generated glyph map holds `__COLOR__` where phosphor had `currentColor`.
 *
 * Ported components use this in place of `@phosphor-icons/react`; the `name` is
 * the same component name the React file imports (`<CaretDown weight="bold" />`
 * becomes `<Icon name="CaretDown" weight="bold" />`), and an unknown name is a
 * type error at the call site.
 *
 * @example
 * ```tsx
 * import { Icon } from "@horon-ai/lynx";
 *
 * <Icon name="MagnifyingGlass" size={16} color="text-secondary" />
 * <Icon name="Check" weight="bold" color="#17181a" />
 * ```
 */
export function Icon({ name, size = 16, weight = "regular", color = "text-primary", className }: IconProps) {
  const theme = useHoronTheme();

  const content = useMemo(() => {
    const glyphs = PHOSPHOR[name];
    const svg = glyphs[weight] ?? glyphs.regular;
    if (!svg) return "";
    const fill = isHexColor(color) ? color : theme.color(color);
    return svg.replaceAll("__COLOR__", fill);
  }, [name, weight, color, theme]);

  return (
    <view
      className={cn("flex items-center justify-center", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg content={content} style={{ width: `${size}px`, height: `${size}px` }} />
    </view>
  );
}

export { PHOSPHOR, iconNames, type IconName, type IconWeight } from "./phosphor.g";

/** The raw hex of a colour token for the current scheme; handy when an SVG needs a literal. */
export function useIconColor(color: IconColor): string {
  const theme = useHoronTheme();
  return isHexColor(color) ? color : theme.color(color);
}

export type { ColorToken } from "../provider";
