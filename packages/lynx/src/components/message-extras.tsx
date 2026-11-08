import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/** The native surface React spread onto a `div`. Lynx has no div, so only the members a caller uses are declared. */
type PortedDivAttributes = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the block's own. */
  style?: CSSProperties;
};

/**
 * Figma `Date separator` (Message extras 109:667): caption between two 10% ink lines.
 *
 * Lynx has no `role="separator"` attribute, so the row is announced through the closest
 * accessibility role description instead.
 */
// prettier-ignore
export function DateSeparator({ children, className }: {
  /** Caption text between the rules, such as "Today" or "Mar 4". */
  children: ReactNode;
  /** Extra classes on the row, merged after the built-in ones. */
  className?: string;
}) {
  return (
    <view
      className={cn("flex flex-row items-center gap-3", className)}
      accessibility-element
      accessibility-role-description="separator"
    >
      <view className="h-px flex-1 bg-overlay-ink-10" accessibility-element={false} />
      <text className="shrink-0 text-caption text-text-secondary">{children}</text>
      <view className="h-px flex-1 bg-overlay-ink-10" accessibility-element={false} />
    </view>
  );
}

/** One button of a {@link MessageActions} pill. */
export type MessageAction = {
  /** Accessible label of the button; also its React key, so keep labels unique within a pill. */
  label: string;
  /** 16px glyph; sized by the pill's `[&>svg]:size-4` in React, by the pill here. */
  icon: ReactNode;
  /** Fires on click. */
  onClick?: () => void;
};

/**
 * Figma `Message actions` (109:667): a pill of 30px icon buttons with 16px icons, solid or regular glass.
 *
 * React's `role="toolbar"` becomes a Lynx role description, since the attribute set has no toolbar
 * role. Lynx has no hover, so React's hover circle is dropped and only the pressed fill stays. With
 * `surface="glass"` it paints a `LiquidGlass` layer and the buttons sit above it.
 *
 * @example
 * ```tsx
 * import { Icon, MessageActions } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <MessageActions
 *       actions={[
 *         { label: "Copy", icon: <Icon name="Copy" />, onClick: () => copy(text) },
 *         { label: "Regenerate", icon: <Icon name="ArrowClockwise" />, onClick: regenerate },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function MessageActions({
  actions,
  surface = "solid",
  className,
}: {
  /** Buttons of the pill, rendered in order; each needs a unique label. */
  actions: MessageAction[];
  /** `solid` (default) is an opaque surface pill with a default border; `glass` is the regular glass pill. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes on the pill, merged after the built-in ones. */
  className?: string;
}) {
  return (
    <view
      className={cn(
        "relative flex w-fit flex-row items-center gap-0.5 overflow-hidden rounded-full p-[3px]",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      accessibility-element
      accessibility-role-description="toolbar"
    >
      {surface === "glass" && <LiquidGlass />}
      {actions.map((action) => (
        <view
          key={action.label}
          className="motion-press motion-colors relative flex size-[30px] shrink-0 cursor-pointer flex-row items-center justify-center rounded-full text-text-secondary active:bg-overlay-ink-6"
          bindtap={action.onClick}
          accessibility-element
          accessibility-traits="button"
          accessibility-label={action.label}
          accessibility-role-description="button"
        >
          {action.icon}
        </view>
      ))}
    </view>
  );
}

/** Props for {@link Attachment}: what the file is, how it looks and whether it can be removed. */
export type AttachmentProps = {
  /** File name, truncated to one line. */
  name: ReactNode;
  /** Caption, such as "PDF · 2.4 MB". */
  detail?: ReactNode;
  /** Image thumbnail URL; files show a document icon on a sky tile. */
  thumbnail?: string;
  /** Renders the 32px remove button when set. */
  onRemove?: () => void;
  /** Accessible label of the remove button.
   * @default "Remove" */
  removeLabel?: string;
  /** Extra classes on the card, merged after the built-in ones. */
  className?: string;
};

/**
 * Figma `Attachment` (109:667): a flat subtle card with a 40px thumb, name, detail and remove button.
 *
 * Lynx has no CSS `background-image`, so the thumbnail is an `<image>` with `aspectFill` cropped to the
 * 40px tile, which draws the same cover crop React asked for.
 *
 * @example
 * ```tsx
 * <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => remove()} />
 * ```
 */
export function Attachment({ name, detail, thumbnail, onRemove, removeLabel = "Remove", className }: AttachmentProps) {
  return (
    <view
      className={cn(
        "motion-rise flex w-full min-w-0 max-w-[280px] flex-row items-center gap-2.5 rounded-lg bg-bg-subtle py-2 pl-2 pr-2",
        className,
      )}
    >
      {thumbnail ? (
        <view className="relative size-10 shrink-0 overflow-hidden rounded-[10px]" accessibility-element={false}>
          <image src={thumbnail} mode="aspectFill" className="size-full" accessibility-element={false} />
        </view>
      ) : (
        <view
          className="flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px] bg-accent-sky-500-16"
          accessibility-element={false}
        >
          <Icon name="FileText" size={20} color="text-brand" />
        </view>
      )}
      <view className="flex min-w-0 flex-1 flex-col gap-px">
        <text className="overflow-hidden text-ellipsis whitespace-nowrap text-label-md text-text-primary">{name}</text>
        {detail ? (
          <text className="overflow-hidden text-ellipsis whitespace-nowrap text-caption text-text-secondary">
            {detail}
          </text>
        ) : null}
      </view>
      {onRemove ? (
        <IconButton
          size="sm"
          icon={<Icon name="X" />}
          label={removeLabel}
          onClick={onRemove}
          className="text-text-secondary"
        />
      ) : null}
    </view>
  );
}

/** Props for {@link CodeBlock}: the code text, its language caption and the copy-button labels. */
export type CodeBlockProps = Omit<PortedDivAttributes, "className"> & {
  /** Source text, rendered verbatim inside a horizontal scroller. */
  code: string;
  /** Caption in the header bar, such as "tsx"; the space is kept even when empty. */
  language?: string;
  /** Copy-button text before the copy succeeds.
   * @default "Copy" */
  copyLabel?: string;
  /** Copy-button text for 1500ms after a successful copy.
   * @default "Copied" */
  copiedLabel?: string;
  /** Extra classes on the outer `div`, merged after the built-in ones. */
  className?: string;
};

/**
 * Figma `Code block` (109:667): ink surface, 14px radius, 6% header with copy, Geist Mono 13/20 code.
 *
 * Lynx has no `<pre>`, so the code is one `<text>` with `whitespace-pre` inside a horizontal
 * `scroll-view`: the line breaks survive and an over-wide line scrolls instead of wrapping. The copy
 * button stays mounted, because it is part of the Figma frame; on a native engine the clipboard is
 * absent, so a tap changes nothing and the label stays `copyLabel` (see `useCopyToClipboard`).
 *
 * @example
 * ```tsx
 * <CodeBlock language="bash" code={"horon routine run weekly-report"} />
 * ```
 */
export function CodeBlock({
  code,
  language,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  className,
  id,
  style,
}: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard(1500);
  return (
    <view
      className={cn("flex flex-col overflow-hidden rounded-lg bg-surface-ink", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex flex-row items-center gap-2 bg-bg-surface-6 py-2 pl-3.5 pr-3.5">
        <view className="min-w-0 flex-1">
          <text className="text-caption text-text-on-ink opacity-70">{language}</text>
        </view>
        <view
          className="motion-press flex shrink-0 cursor-pointer flex-row items-center gap-1"
          bindtap={() => copy(code)}
          accessibility-element
          accessibility-traits="button"
          accessibility-role-description="button"
          accessibility-label={copyLabel}
        >
          <Icon name="Copy" size={14} color="text-on-ink" />
          <view className="min-w-10">
            <text className="text-left text-caption text-text-on-ink">{copied ? copiedLabel : copyLabel}</text>
          </view>
        </view>
      </view>
      <scroll-view scroll-orientation="horizontal" scroll-bar-enable={false} className="overflow-hidden">
        <view className="px-3.5 pb-3.5 pt-3">
          <text className="whitespace-pre font-mono text-code text-text-on-ink">{code}</text>
        </view>
      </scroll-view>
    </view>
  );
}
