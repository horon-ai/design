import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

/** Figma `Kbd` (Command palette 110:676): a 6% ink chip with caption text. */
export function Kbd({ className, ...props }: Omit<ComponentProps<"kbd">, "className"> & { className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-xs bg-overlay-ink-6 px-1.5 py-px font-sans text-caption whitespace-nowrap text-text-secondary [&_svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}
