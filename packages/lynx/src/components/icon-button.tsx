import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

/**
 * Fill and text colour of an icon button:
 *
 * - `primary`: solid brand fill with the inverse icon, for the one main action in a cluster.
 * - `ghost` (default): no fill until press, primary icon; the common toolbar and row action.
 * - `glass`: the clear glass disc with a `LiquidGlass` layer, for floating chrome over imagery.
 * - `solid`: bordered raised surface, for a button that sits on the page background.
 * - `quiet`: no fill and no liquid layer, secondary icon that turns primary while pressed; for dark
 *   shells and title bars where a glass disc would read as a grey bubble.
 */
export type IconButtonVariant = "primary" | "ghost" | "glass" | "solid" | "quiet";
/** Square footprint: `sm` 32px, `md` 40px, `lg` 48px. */
export type IconButtonSize = ControlSize;

/**
 * The native surface React took from Base UI and the DOM `button` element. Lynx
 * has no button element, so the members a caller uses are declared here and
 * forwarded to the `view` that draws the disc.
 */
type PortedIconButtonAttributes = {
  /** Runs when the disc is tapped; a disabled disc never runs it. */
  onClick?: () => void;
  /** Blocks interaction, dims the disc to 40% and announces it as disabled. */
  disabled?: boolean;
  /** Kept for call-site parity. Lynx has no form submission, so it is inert. */
  type?: "button" | "submit" | "reset";
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Form field value. Accepted for call-site parity; Lynx has no form submission. */
  value?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the disc's own. */
  style?: CSSProperties;
};

/** Props of {@link IconButton}: the treatment, the footprint and the glyph. */
export type IconButtonProps = Omit<PortedIconButtonAttributes, "className" | "children"> & {
  /** Treatment, from the list on `IconButtonVariant`. @default "ghost" */
  variant?: IconButtonVariant;
  /** Square footprint: `sm` 32px, `md` 40px, `lg` 48px, with the icon at 16/20/24px. @default "md" */
  size?: IconButtonSize;
  /** The glyph. It is wrapped in a positioning view; size it through the button rather than by hand. */
  icon: ReactNode;
  /** Accessible name; the button has no visible text. */
  label: string;
  /** Extra classes for the button. */
  className?: string;
};

const sizeClass: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/** React sized the glyph through `[&_svg]:size-4|5|6`; Lynx's `<Icon>` takes the px number. */
const iconSize: Record<IconButtonSize, number> = { sm: 16, md: 20, lg: 24 };

/** Lynx has no hover, so React's hover fill is dropped and only the pressed fill stays. */
const variantClass: Record<IconButtonVariant, string> = {
  primary: "bg-interactive-primary active:bg-interactive-primary-pressed",
  ghost: "active:bg-overlay-ink-10",
  glass: "bg-glass-clear active:bg-glass-clear-pressed",
  solid: "border border-border-default bg-bg-surface active:bg-interactive-secondary-hover",
  // No fill and no liquid layer: only the ink wash while pressed. A glass disc is wrong on a dark
  // shell or title bar, where `glass` reads as a grey bubble; this keeps the icon legible without one.
  quiet: "active:bg-overlay-ink-10",
};

const iconColor: Record<IconButtonVariant, IconProps["color"]> = {
  primary: "interactive-on-primary",
  ghost: "text-primary",
  glass: "text-primary",
  solid: "text-primary",
  quiet: "text-secondary",
};

/** Sizes a caller's glyph through the button, as React's `[&_svg]:size-*` did. */
const tintIcon = (node: ReactNode, size: number, color: IconProps["color"]): ReactNode =>
  isValidElement<IconProps>(node) && node.type === Icon ? cloneElement(node, { size, color }) : node;

/**
 * Figma `Icon button` (57:167): Primary, Ghost, Glass and Solid in three sizes, plus a fill-free `quiet` variant.
 *
 * A round, icon-only Lynx `view` with `accessibility-traits="button"`, because
 * Lynx has no button element: `label` becomes `accessibility-label`, since
 * nothing is visible. The disc is 32/40/48px while `hit-slop` keeps a 44px touch
 * target around it without moving a pixel. It renders `LiquidGlass` inside the
 * `glass` variant only, and a disabled disc is 40% opacity and announced as
 * disabled. Lynx has no hover, so React's hover fills are omitted and only the
 * pressed fills remain.
 *
 * @example
 * ```tsx
 * import { Icon } from "@horon-ai/lynx";
 * import { IconButton } from "@horon-ai/lynx";
 *
 * function Actions() {
 *   return (
 *     <view className="flex flex-row items-center gap-1">
 *       <IconButton icon={<Icon name="Plus" />} label="New agent" variant="primary" />
 *       <IconButton icon={<Icon name="DotsThree" />} label="Settings" />
 *     </view>
 *   );
 * }
 * ```
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  icon,
  label,
  className,
  onClick,
  disabled = false,
  type: _type,
  name: _name,
  value: _value,
  id,
  style,
}: IconButtonProps) {
  return (
    <view
      className={cn(
        "motion-press relative flex shrink-0 select-none flex-row items-center justify-center overflow-hidden rounded-full",
        disabled ? "opacity-40" : "cursor-pointer",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      style={style}
      // React painted a 44px reach with an invisible `::after`; Lynx has no
      // pseudo-element, so the same reach is `hit-slop`: sm 32px needs 6px a
      // side, md 40px needs 2px, lg 48px already exceeds it.
      hit-slop={size === "sm" ? "6px" : size === "md" ? "2px" : undefined}
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-label={label}
      accessibility-role-description="button"
      {...(id === undefined ? {} : { id })}
    >
      {variant === "glass" && <LiquidGlass />}
      <view className="relative flex flex-row items-center">{tintIcon(icon, iconSize[size], iconColor[variant])}</view>
    </view>
  );
}
