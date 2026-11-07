import { Children, cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/**
 * Visual treatment of {@link Button}.
 *
 * - `primary` — filled brand button, for the single main action of a screen or dialog.
 * - `glass` — clear glass fill with a {@link LiquidGlass} layer, for chrome floating over imagery.
 * - `solid` — bordered surface button, for secondary actions on a page.
 * - `danger` — filled destructive action, such as delete.
 * - `link` — size-independent text-only button; its `aria-current="page"` / `aria-current="true"` state
 *   colors it like primary text, which is how an active navigation link is marked.
 */
export type ButtonVariant = "primary" | "glass" | "solid" | "danger" | "link";
/**
 * Height and text rung of a non-`link` {@link Button}, identical to {@link ControlSize}:
 * `sm` 32px `label-md`, `md` 40px `label-lg`, `lg` 48px `label-lg`.
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * The native surface React took from Base UI and, before that, from the DOM
 * `button` element. Lynx has no button element and no form, so the members a
 * caller actually uses are declared here and forwarded to the `view` that draws
 * the control. Keeping them in their own type lets {@link ButtonProps} stay one
 * flat object, which is what React's own prop type was.
 */
type PortedButtonAttributes = {
  /** Runs when the button is tapped; a disabled button never runs it. */
  onClick?: () => void;
  /** Blocks interaction, dims the control to 40% and announces it as disabled. */
  disabled?: boolean;
  /** Kept for call-site parity. Lynx has no form submission, so it is inert. */
  type?: "button" | "submit" | "reset";
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Form field value. Accepted for call-site parity; Lynx has no form submission. */
  value?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the button's own. */
  style?: CSSProperties;
  /** Accessible name when the visible label is not the whole name. */
  "aria-label"?: string;
  /** Marks an active navigation link; the `page` state colors the label like primary text. */
  "aria-current"?: "page" | "true" | "false" | boolean;
};

type ButtonCommonProps = {
  /**
   * Visual treatment; `link` ignores the size rungs.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Height and label rung of the control; `link` stays text-only.
   * @default "md"
   */
  size?: ButtonSize;
  /** Leading icon; sized 16px (sm, md) or 20px (lg) and colored like the label. */
  icon?: ReactNode;
  /** Extra classes appended last, so a caller can add width, margins or overrides. */
  className?: string;
};

/**
 * Props of {@link Button}.
 *
 * React's version was one flat intersection of the common props, anchor
 * attributes and Base UI's button props, so a caller that forwards the
 * component's props (`Omit<ButtonProps, …>`) gets a single object type. That
 * shape is kept here.
 *
 * `href`, `target`, `rel` and `download` stay accepted for call-site parity, but
 * Lynx has no anchor element and no navigation primitive (`lynx` exposes no
 * `open`/`navigateTo`), so they are inert: the same control is drawn and every
 * tap arrives through `onClick`, which is where a host routes the navigation.
 */
export type ButtonProps = ButtonCommonProps &
  Omit<PortedButtonAttributes, "className"> & {
    /** A link target in React. Accepted for parity; on Lynx the tap arrives through `onClick`. */
    href?: string;
    /** Anchor target window. Accepted for parity, inert on Lynx. */
    target?: string;
    /** Anchor relationship. Accepted for parity, inert on Lynx. */
    rel?: string;
    /** Anchor download hint. Accepted for parity, inert on Lynx. */
    download?: string | boolean;
    /** The label; a plain string or number is trimmed and centered, any node is laid out in a row. */
    children?: ReactNode;
  };

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-label-md",
  md: "h-10 gap-2 px-4 text-label-lg",
  lg: "h-12 gap-2 px-5 text-label-lg",
};

/** Lynx has no hover, so React's hover fill is dropped and only the pressed fill stays. */
const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-interactive-primary active:bg-interactive-primary-pressed",
  glass: "bg-glass-clear active:bg-glass-clear-pressed",
  solid: "border border-border-default bg-bg-surface active:bg-interactive-secondary-hover",
  danger: "bg-interactive-danger active:bg-interactive-danger-hover",
  link: "gap-1.5 rounded-sm px-1 text-label-sm motion-colors",
};

/** React sized the icon through `[&_svg]:size-4|5`, and `size-3.5` on `link`; `<Icon>` takes px. */
const iconSize: Record<ButtonSize, number> = { sm: 16, md: 16, lg: 20 };
const LINK_ICON_SIZE = 14;

const iconColor: Record<ButtonVariant, IconProps["color"]> = {
  primary: "interactive-on-primary",
  glass: "text-primary",
  solid: "text-primary",
  danger: "interactive-on-danger",
  link: "text-secondary",
};

const textClass: Record<ButtonSize, string> = { sm: "text-label-md", md: "text-label-lg", lg: "text-label-lg" };

const textColor: Record<ButtonVariant, string> = {
  primary: "text-interactive-on-primary",
  glass: "text-text-primary",
  solid: "text-text-primary",
  danger: "text-interactive-on-danger",
  link: "text-text-secondary",
};

/** Sizes a caller's icon through the button, as React's `[&_svg]:size-*` did. */
const tintIcon = (node: ReactNode, size: number, color: IconProps["color"]): ReactNode =>
  isValidElement<IconProps>(node) && node.type === Icon ? cloneElement(node, { size, color }) : node;

/**
 * Figma `Button` (55:339): Primary, Glass, Solid and Danger in three sizes, plus a text-only `link` variant (size-independent).
 *
 * A Lynx `view` with `accessibility-traits="button"`, because Lynx has no button
 * element: there is no form submission, no anchor and no hover. Sizes `sm` and
 * `md` reach for an invisible 44px target through `hit-slop`, so the painted
 * control keeps its 32/40px height and nothing moves. A non-`link` button also
 * accepts an `icon` before the label and, on `glass`, a {@link LiquidGlass} layer
 * beneath its content. A disabled button drops its tap handler, dims to 40% and
 * announces itself as disabled.
 *
 * @example
 * ```tsx
 * import { Button } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-row items-center gap-2">
 *       <Button onClick={() => save()}>Save changes</Button>
 *       <Button variant="solid" size="sm">Cancel</Button>
 *       <Button variant="link" onClick={() => open("/settings")}>Settings</Button>
 *     </view>
 *   );
 * }
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  href: _href,
  target: _target,
  rel: _rel,
  download: _download,
  onClick,
  disabled = false,
  type: _type,
  name: _name,
  value: _value,
  id,
  style,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: ButtonProps) {
  const current = variant === "link" && (ariaCurrent === "page" || ariaCurrent === "true");
  const isPlain = typeof children === "string" || typeof children === "number";
  const hasElementChild = Children.toArray(children).some(
    (child) => typeof child !== "string" && typeof child !== "number",
  );

  const classes = cn(
    "relative flex shrink-0 flex-row items-center justify-center overflow-hidden whitespace-nowrap select-none",
    variant === "link" ? "" : "motion-press rounded-full",
    variant === "link" ? "" : sizeClass[size],
    disabled ? "opacity-40" : "cursor-pointer",
    variantClass[variant],
    current && "text-text-primary",
    className,
  );

  // React painted a 44px reach with an invisible `::after`; Lynx has no
  // pseudo-element, so the same reach is `hit-slop` and the box stays put:
  // sm 32px needs 6px a side, md 40px needs 2px, lg 48px already exceeds it.
  const hitSlop = variant === "link" ? undefined : size === "sm" ? "6px" : size === "md" ? "2px" : undefined;

  return (
    <view
      className={classes}
      style={style}
      hit-slop={hitSlop}
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : variant === "link" ? "link" : "button"}
      accessibility-label={ariaLabel}
      accessibility-value={current ? "current page" : undefined}
      {...(id === undefined ? {} : { id })}
    >
      {variant === "glass" && <LiquidGlass />}
      {icon ? (
        <view className="relative flex shrink-0 flex-row items-center">
          {tintIcon(icon, variant === "link" ? LINK_ICON_SIZE : iconSize[size], current ? "text-primary" : iconColor[variant])}
        </view>
      ) : null}
      <view className={cn("relative flex flex-row items-center", hasElementChild && (variant === "link" ? "gap-1.5" : size === "sm" ? "gap-1.5" : "gap-2"))}>
        {isPlain ? (
          <text
            className={cn(
              variant === "link" ? "text-label-sm" : "text-trim",
              textColor[variant],
              current ? "text-text-primary" : "",
              variant === "link" ? "" : textClass[size],
            )}
          >
            {children}
          </text>
        ) : (
          children
        )}
      </view>
    </view>
  );
}
