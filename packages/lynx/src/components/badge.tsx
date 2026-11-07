import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Tint of the pill and its dot; `neutral` is the default.
 *
 * - `neutral`: 6% ink pill with secondary text, the default.
 * - `brand`: sky-tinted pill with brand text, for counts and states tied to the brand.
 * - `danger`: red-tinted pill with danger text, for errors and destructive states.
 * - `solid`: filled brand pill with on-primary text, for the strongest emphasis.
 * - `surface`: the raised-surface pill with a 1px default border and primary text.
 */
export type BadgeTone = "neutral" | "brand" | "danger" | "solid" | "surface";
/** Size token shared with the form controls (`sm`, `md`, `lg`); the rendered heights are documented on {@link Badge}. */
export type BadgeSize = ControlSize;

/**
 * The native surface React spread onto a `span`. Lynx has no span, so the pill is
 * a `view` and only the members a caller uses are declared.
 */
type PortedSpanAttributes = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the pill's own. */
  style?: CSSProperties;
};

/** Props for {@link Badge}: the tone, size, optional status dot and extra span props. */
export type BadgeProps = Omit<PortedSpanAttributes, "className"> & {
  /** React spread `ComponentProps<"span">`; Lynx has no span, so the pill is a view. */
  /** Colour treatment of the pill and its dot. @default "neutral" */
  tone?: BadgeTone;
  /** Leading status dot; 4px (sm), 6px (md) or 8px (lg). */
  dot?: boolean;
  /** `md` is the 22px Figma Badge; `sm` 20px and `lg` 26px. @default "md" */
  size?: BadgeSize;
  /** Extra classes merged onto the pill, for margins or alignment. */
  className?: string;
  /** The label; a plain string or number is trimmed, any node is laid out in the pill. */
  children?: ReactNode;
};

const sizeClass: Record<BadgeSize, string> = {
  sm: "h-5 gap-1 px-1.5 text-caption",
  md: "h-[22px] gap-1.5 px-2 text-label-sm",
  lg: "h-[26px] gap-1.5 px-2.5 text-label-md",
};

/** React used `size-1|1.5|2`; the dot is a `view`, so the pair is spelled out. */
const dotSizeClass: Record<BadgeSize, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-overlay-ink-6",
  brand: "bg-accent-sky-500-18",
  danger: "bg-accent-red-500-14",
  solid: "bg-interactive-primary",
  surface: "border border-border-default bg-bg-surface",
};

/** Lynx does not inherit color onto `<text>`, so the label names its own token. */
const textClass: Record<BadgeTone, string> = {
  neutral: "text-text-secondary",
  brand: "text-text-brand",
  danger: "text-text-danger",
  solid: "text-interactive-on-primary",
  surface: "text-text-primary",
};

const dotClass: Record<BadgeTone, string> = {
  neutral: "bg-text-secondary",
  brand: "bg-status-live",
  danger: "bg-text-danger",
  solid: "bg-interactive-on-primary",
  surface: "bg-text-primary",
};

/**
 * Figma `Badge` (61:283): a 22px translucent pill with label-sm text. Renders a non-interactive `view`, so it can
 * sit inside buttons, list rows and headings without changing their layout height.
 *
 * @example
 * ```tsx
 * <Badge tone="brand" dot>
 *   Running
 * </Badge>
 * ```
 */
export function Badge({ tone = "neutral", dot, size = "md", className, children, id, style }: BadgeProps) {
  return (
    <view
      className={cn(
        "flex shrink-0 flex-row items-center justify-center rounded-full whitespace-nowrap",
        sizeClass[size],
        toneClass[tone],
        className,
      )}
      style={style}
      accessibility-element
      accessibility-role-description="text"
      {...(id === undefined ? {} : { id })}
    >
      {dot && <view className={cn("shrink-0 rounded-full", dotSizeClass[size], dotClass[tone])} accessibility-element={false} />}
      <view className="flex flex-row items-center">
        {typeof children === "string" || typeof children === "number" ? (
          <text className={cn("text-trim", textClass[tone])}>{children}</text>
        ) : (
          children
        )}
      </view>
    </view>
  );
}
