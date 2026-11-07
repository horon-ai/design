import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Tint of the pill and its dot; `neutral` is the default.
 *
 * - `neutral`: 6% ink pill with secondary text, the default.
 * - `brand`: sky-tinted pill with brand text, for counts and states tied to the brand.
 * - `danger`: red-tinted pill with danger text, for errors and destructive states.
 * - `solid`: filled brand pill with on-primary text, for the strongest emphasis.
 * - `surface`: the white (raised surface) pill with a 1px default border and primary text.
 */
export type BadgeTone = "neutral" | "brand" | "danger" | "solid" | "surface";
/** Size token shared with the form controls (`sm`, `md`, `lg`); the rendered heights are documented on {@link Badge}. */
export type BadgeSize = ControlSize;

/** Props for {@link Badge}: the tone, size, optional status dot and extra span props. */
export type BadgeProps = Omit<ComponentProps<"span">, "className"> & {
  /** Colour treatment of the pill and its dot. @default "neutral" */
  tone?: BadgeTone;
  /** Leading status dot; 4px (sm), 6px (md) or 8px (lg). */
  dot?: boolean;
  /** `md` is the 22px Figma Badge; `sm` 20px and `lg` 26px. @default "md" */
  size?: BadgeSize;
  /** Extra classes merged onto the pill, for margins or alignment. */
  className?: string;
};

const sizeClass: Record<BadgeSize, string> = {
  sm: "h-5 gap-1 px-1.5 text-caption",
  md: "h-5.5 gap-1.5 px-2 text-label-sm",
  lg: "h-6.5 gap-1.5 px-2.5 text-label-md",
};

const dotSizeClass: Record<BadgeSize, string> = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
};

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-overlay-ink-6 text-text-secondary",
  brand: "bg-accent-sky-500-18 text-text-brand",
  danger: "bg-accent-red-500-14 text-text-danger",
  solid: "bg-interactive-primary text-interactive-on-primary",
  surface: "border border-border-default bg-bg-surface text-text-primary",
};

const dotClass: Record<BadgeTone, string> = {
  neutral: "bg-text-secondary",
  brand: "bg-status-live",
  danger: "bg-text-danger",
  solid: "bg-interactive-on-primary",
  surface: "bg-text-primary",
};

/**
 * Figma `Badge` (61:283): a 22px translucent pill with label-sm text. Renders a non-interactive `span`, so it can
 * sit inside buttons, list rows and headings without changing their layout height.
 *
 * @example
 * ```tsx
 * <Badge tone="brand" dot>
 *   Running
 * </Badge>
 * ```
 */
export function Badge({ tone = "neutral", dot, size = "md", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap",
        sizeClass[size],
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className={cn("shrink-0 rounded-full", dotSizeClass[size], dotClass[tone])} />}
      <span className="text-trim">{children}</span>
    </span>
  );
}
