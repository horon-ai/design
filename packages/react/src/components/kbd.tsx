import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type KbdSize = ControlSize;

export type KbdProps = Omit<ComponentProps<"kbd">, "className"> & {
  /** Chip size: `sm` tighter caption, `md` the Command palette chip (default), `lg` label-sm with more padding. */
  size?: KbdSize;
  className?: string;
};

const sizeClass: Record<KbdSize, string> = {
  sm: "gap-0.5 px-1 text-caption [&_svg]:size-2.5",
  md: "gap-1 px-1.5 py-px text-caption [&_svg]:size-3",
  lg: "gap-1 px-2 py-0.5 text-label-sm [&_svg]:size-3.5",
};

/** Figma `Kbd` (Command palette 110:676): a 6% ink chip with caption text. */
export function Kbd({ size = "md", className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex shrink-0 items-center rounded-xs bg-overlay-ink-6 font-sans whitespace-nowrap text-text-secondary",
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
