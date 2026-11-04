import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** `surface` is the white (raised surface) pill with a 1px default border and primary text. */
export type BadgeTone = "neutral" | "brand" | "danger" | "solid" | "surface";
export type BadgeSize = ControlSize;

export type BadgeProps = Omit<ComponentProps<"span">, "className"> & {
  tone?: BadgeTone;
  /** Leading status dot; 4px (sm), 6px (md) or 8px (lg). */
  dot?: boolean;
  /** `md` is the 22px Figma Badge; `sm` 20px and `lg` 26px. */
  size?: BadgeSize;
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

/** Figma `Badge` (61:283): a 22px translucent pill with label-sm text. */
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
      {children}
    </span>
  );
}
