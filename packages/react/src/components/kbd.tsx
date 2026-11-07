import type { ComponentProps } from "react";

import { usePlatform } from "../hooks/use-platform";
import { cn } from "../lib/cn";
import { formatShortcut } from "../lib/platform";
import type { ControlSize } from "../lib/size";

/** Height rung of the chip, shared with the other sized controls: `sm`, `md`, `lg`. */
export type KbdSize = ControlSize;

/** Props of {@link Kbd}: the native `kbd` attributes plus the chip size. */
export type KbdProps = Omit<ComponentProps<"kbd">, "className"> & {
  /** Chip size: `sm` tighter caption, `md` the Command palette chip (default), `lg` label-sm with more padding. @default "md" */
  size?: KbdSize;
  /** Shortcut such as `Mod+Enter`, drawn with the OS's key labels (`⌘↵` / `Ctrl+Enter`) instead of children. */
  keys?: string;
  /** Extra classes for the `kbd` element. */
  className?: string;
};

/** Chip rungs: 16/20/24px high, so the three sizes read apart instead of only wider padding. */
const sizeClass: Record<KbdSize, string> = {
  sm: "h-4 gap-0.5 px-1 text-caption [&_svg]:size-2.5",
  md: "h-5 gap-1 px-1.5 text-caption [&_svg]:size-3",
  lg: "h-6 gap-1 px-2 text-label-sm [&_svg]:size-3.5",
};

/**
 * Figma `Kbd` (Command palette 110:676): a 6% ink chip with caption text.
 *
 * A `<kbd>` for a keyboard shortcut: inline-flex, `rounded-xs`, secondary text, centred on a trimmed
 * line box so the glyph sits optically centred in the chip. Pass `keys` as a `+`-joined shortcut such as
 * `Mod+Enter` and the chip draws the OS's labels — `⌘↵` on macOS and iOS, `Ctrl+Enter` on Windows, Linux
 * and Android, and the Mac symbols whenever the OS is still unknown (server render, first hydration pass).
 * Without `keys` it renders `children`, so several chips can be composed by hand
 * (`<Kbd>⌘</Kbd><Kbd>K</Kbd>`). Sizes are 16/20/24px tall, and any icon inside is resized with the chip
 * (`2.5`/`3`/`3.5`), so pass a bare Phosphor icon or glyph.
 *
 * @example
 * ```tsx
 * import { Kbd } from "@horon-ai/react";
 *
 * function Hint() {
 *   return (
 *     <span className="flex items-center gap-1 text-caption">
 *       Search <Kbd keys="Mod+K" />
 *     </span>
 *   );
 * }
 * ```
 */
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
