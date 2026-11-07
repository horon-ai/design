import { useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";

/**
 * Props for {@link ToolCallsHeader}.
 */
export type ToolCallsHeaderProps = {
  /** Up to three 14px tool icons, drawn as overlapping 28px chips. */
  icons?: ReactNode;
  /** Header text; defaults to "Using tools…". @default "Using tools…" */
  title?: ReactNode;
  /** Elapsed time, such as "4.0s". */
  elapsed?: ReactNode;
  /** `ToolCall` cards, stacked 8px apart under the header. */
  children?: ReactNode;
  /** Starts with the cards shown; the group manages its own open state afterwards. @default true */
  defaultOpen?: boolean;
  /** Controlled open state; pass `onOpenChange` too when set. */
  open?: boolean;
  /** Called with the next open state whenever the trigger is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes for the outer card. */
  className?: string;
};

/** One 28px tool chip: a subtle square with a 2px surface border that paints the overlap seam. */
const CHIP = "flex size-7 shrink-0 flex-row items-center justify-center rounded-[10px] border-2 border-bg-surface bg-bg-subtle";

/**
 * Figma `Tool-calls header` (Agents N11): overlapping tool chips, "Using tools…" and a caret that fold the ToolCall cards below.
 *
 * Only the first three icons are drawn, each as a 28px chip. Base UI's collapsible is replaced by
 * local state that `open` / `onOpenChange` can take over: the caret rotates in place while the cards
 * render under the trigger, and a closed group renders no panel at all because Lynx cannot animate a
 * collapsing height. React drew the chip ring with `ring-2`; the v3 preset behind Lynx has no ring
 * utility, so every chip takes a 2px surface border instead, which paints the same overlap seam.
 *
 * @example
 * ```tsx
 * import { Icon, ToolCall, ToolCallsHeader } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <ToolCallsHeader
 *       icons={[
 *         <Icon key="globe" name="Globe" size={14} color="text-primary" />,
 *         <Icon key="terminal" name="Terminal" size={14} color="text-primary" />,
 *       ]}
 *       elapsed="4.0s"
 *     >
 *       <ToolCall status="done" tool={{ icon: <Icon name="Globe" />, name: "Web search" }} summary="Searched the docs" />
 *     </ToolCallsHeader>
 *   );
 * }
 * ```
 */
export function ToolCallsHeader({
  icons,
  title = "Using tools…",
  elapsed,
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
}: ToolCallsHeaderProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;
  // React's `Children.toArray` dropped null, undefined and boolean entries before slicing, so an
  // icon slot the caller leaves empty draws no chip here either.
  const chips = (Array.isArray(icons) ? icons : [icons]).filter(
    (icon): icon is Exclude<ReactNode, null | undefined | boolean> => icon !== null && icon !== undefined && typeof icon !== "boolean",
  ).slice(0, 3);

  const toggle = () => {
    const next = !open;
    if (!controlled) setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <view
      className={cn(
        "flex w-full min-w-0 flex-col rounded-xl border border-border-default bg-bg-surface p-3",
        className,
      )}
    >
      <view
        className="flex w-full min-w-0 flex-row items-center gap-2.5 pb-1"
        bindtap={toggle}
        accessibility-element
        accessibility-traits="button"
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        {chips.length > 0 ? (
          <view className="flex shrink-0 flex-row items-center">
            <view className={CHIP} accessibility-elements-hidden>
              {chips[0]}
            </view>
            {chips[1] ? (
              <view className={CHIP} style={{ marginLeft: "-8px" }} accessibility-elements-hidden>
                {chips[1]}
              </view>
            ) : null}
            {chips[2] ? (
              <view className={CHIP} style={{ marginLeft: "-8px" }} accessibility-elements-hidden>
                {chips[2]}
              </view>
            ) : null}
          </view>
        ) : null}
        {typeof title === "string" || typeof title === "number" ? (
          <text className="min-w-0 flex-1 truncate text-label-md text-text-primary">{title}</text>
        ) : (
          <view className="min-w-0 flex-1">{title}</view>
        )}
        {elapsed ? (
          typeof elapsed === "string" || typeof elapsed === "number" ? (
            <text className="shrink-0 text-label-md text-text-secondary">· {elapsed}</text>
          ) : (
            <view className="shrink-0 flex flex-row items-center gap-1">
              <text className="text-label-md text-text-secondary">·</text>
              {elapsed}
            </view>
          )
        ) : null}
        <view
          className="flex size-4 shrink-0 flex-row items-center justify-center"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          accessibility-elements-hidden
        >
          <Icon name="CaretDown" size={16} color="text-secondary" />
        </view>
      </view>
      {open ? <view className="flex min-w-0 flex-col gap-2 pt-1">{children}</view> : null}
    </view>
  );
}
