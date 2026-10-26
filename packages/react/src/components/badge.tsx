import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

export type BadgeTone = "neutral" | "brand" | "danger" | "solid";

export type BadgeProps = Omit<ComponentProps<"span">, "className"> & {
  tone?: BadgeTone;
  /** Leading 6px status dot. */
  dot?: boolean;
  className?: string;
};

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-overlay-ink-6 text-text-secondary",
  brand: "bg-accent-sky-500-18 text-text-brand",
  danger: "bg-accent-red-500-14 text-text-danger",
  solid: "bg-interactive-primary text-interactive-on-primary",
};

const dotClass: Record<BadgeTone, string> = {
  neutral: "bg-text-secondary",
  brand: "bg-status-live",
  danger: "bg-text-danger",
  solid: "bg-interactive-on-primary",
};

/** Figma `Badge` (61:283): a 22px translucent pill with label-sm text. */
export function Badge({ tone = "neutral", dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5.5 shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-label-sm whitespace-nowrap",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", dotClass[tone])} />}
      {children}
    </span>
  );
}
