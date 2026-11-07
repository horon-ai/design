import type { ComponentProps } from "react";

import { usePlatform } from "../hooks/use-platform";
import { cn } from "../lib/cn";
import { formatShortcut } from "../lib/platform";
import type { ControlSize } from "../lib/size";

export type KbdSize = ControlSize;

export type KbdProps = Omit<ComponentProps<"kbd">, "className"> & {
  /** Chip size: `sm` tighter caption, `md` the Command palette chip (default), `lg` label-sm with more padding. */
  size?: KbdSize;
  /** Shortcut such as `Mod+Enter`, drawn with the OS's key labels (`⌘↵` / `Ctrl+Enter`) instead of children. */
  keys?: string;
  className?: string;
};

/** Chip rungs: 16/20/24px high, so the three sizes read apart instead of only wider padding. */
const sizeClass: Record<KbdSize, string> = {
  sm: "h-4 gap-0.5 px-1 text-caption [&_svg]:size-2.5",
  md: "h-5 gap-1 px-1.5 text-caption [&_svg]:size-3",
  lg: "h-6 gap-1 px-2 text-label-sm [&_svg]:size-3.5",
};

/** Figma `Kbd` (Command palette 110:676): a 6% ink chip with caption text. */
export function Kbd({ size = "md", keys, className, children, ...props }: KbdProps) {
  const { os } = usePlatform();
  return (
    <kbd
      className={cn(
        "inline-flex shrink-0 items-center rounded-xs bg-overlay-ink-6 font-sans leading-none whitespace-nowrap text-text-secondary",
        sizeClass[size],
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-[inherit] text-trim">
        {keys === undefined ? children : formatShortcut(keys, os)}
      </span>
    </kbd>
  );
}
