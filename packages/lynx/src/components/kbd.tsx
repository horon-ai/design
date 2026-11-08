import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { usePlatform } from "../hooks/use-platform";
import { cn } from "../lib/cn";
import { formatShortcut } from "../lib/platform";
import type { ControlSize } from "../lib/size";

/** Height rung of the chip, shared with the other sized controls: `sm`, `md`, `lg`. */
export type KbdSize = ControlSize;

/**
 * The native surface React spread onto a `kbd` element. Lynx has no `kbd`, so the
 * chip is a `view` and only the members a caller uses are declared.
 */
type PortedKbdAttributes = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the chip's own. */
  style?: CSSProperties;
};

/** Props of {@link Kbd}: the native `kbd` attributes plus the chip size. */
export type KbdProps = Omit<PortedKbdAttributes, "className"> & {
  /** React spread `ComponentProps<"kbd">`; Lynx has no kbd element, so the chip is a view. */
  /** Chip size: `sm` tighter caption, `md` the Command palette chip (default), `lg` label-sm with more padding. @default "md" */
  size?: KbdSize;
  /** Shortcut such as `Mod+Enter`, drawn with the OS's key labels (`⌘↵` / `Ctrl+Enter`) instead of children. */
  keys?: string;
  /** Extra classes for the chip. */
  className?: string;
  /** The glyph to draw when `keys` is absent; several chips compose a shortcut by hand. */
  children?: ReactNode;
};

/** Chip rungs: 16/20/24px high, so the three sizes read apart instead of only wider padding. */
const sizeClass: Record<KbdSize, string> = {
  sm: "h-4 gap-0.5 px-1 text-caption",
  md: "h-5 gap-1 px-1.5 text-caption",
  lg: "h-6 gap-1 px-2 text-label-sm",
};

/**
 * Figma `Kbd` (Command palette 110:676): a 6% ink chip with caption text.
 *
 * A keyboard-shortcut chip, drawn as a `view` because Lynx has no `kbd` element:
 * `rounded-xs`, secondary text, centred on a trimmed line box so the glyph sits
 * optically centred in the chip. Pass `keys` as a `+`-joined shortcut such as
 * `Mod+Enter` and the chip draws the OS's labels — `⌘↵` on macOS and iOS,
 * `Ctrl+Enter` on Windows, Linux and Android, and the Mac symbols whenever the
 * OS is still unknown (a host that reports no `SystemInfo.platform`). Without
 * `keys` it renders `children`, so several chips can be composed by hand
 * (`<Kbd>⌘</Kbd><Kbd>K</Kbd>`). Sizes are 16/20/24px tall.
 *
 * @example
 * ```tsx
 * import { Kbd } from "@horon-ai/lynx";
 *
 * function Hint() {
 *   return (
 *     <view className="flex flex-row items-center gap-1">
 *       <text className="text-caption text-text-secondary">Search</text>
 *       <Kbd keys="Mod+K" />
 *     </view>
 *   );
 * }
 * ```
 */
export function Kbd({ size = "md", keys, className, children, id, style }: KbdProps) {
  const { os } = usePlatform();
  const label = keys === undefined ? undefined : formatShortcut(keys, os);

  return (
    <view
      className={cn(
        "flex shrink-0 flex-row items-center whitespace-nowrap rounded-xs bg-overlay-ink-6 font-sans leading-none",
        sizeClass[size],
        className,
      )}
      style={style}
      accessibility-element
      accessibility-role-description="text"
      {...(id === undefined ? {} : { id })}
    >
      <view className={cn("flex flex-row items-center", size === "sm" ? "gap-0.5" : "gap-1")}>
        {keys === undefined ? (
          typeof children === "string" || typeof children === "number" ? (
            <text className="text-trim text-text-secondary">{children}</text>
          ) : (
            children
          )
        ) : (
          <text className="text-trim text-text-secondary">{label}</text>
        )}
      </view>
    </view>
  );
}
