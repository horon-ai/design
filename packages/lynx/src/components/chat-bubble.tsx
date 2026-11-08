import type { ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Padding and text rung of {@link ChatBubble}; identical to {@link ControlSize}. */
export type ChatBubbleSize = ControlSize;

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the entry
 * lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string };
};

/**
 * Props of {@link ChatBubble}. React spread the remaining `div` attributes; Lynx has no DOM element to
 * forward them to, so the bubble takes only the message content and its classes.
 */
export type ChatBubbleProps = Omit<PortedElementProps["div"], "className"> & {
  /**
   * `me` is the ink bubble, `bot` the flat subtle bubble. Neither uses glass.
   * @default "me"
   */
  from?: "me" | "bot";
  /**
   * Bubble size: `sm` 12/8px padding with body-sm, `md` 16/12px with body-md (default), `lg` 20/14px with body-lg.
   * @default "md"
   */
  size?: ChatBubbleSize;
  /** Extra classes merged onto the bubble. */
  className?: string;
  /** The message. Every child sits inside the bubble's own `<text>`, because Lynx text does not inherit into a `<view>`. */
  children?: ReactNode;
};

/** Box padding per rung; the type rides on the inner `<text>` because Lynx does not inherit it. */
const sizeClass: Record<ChatBubbleSize, string> = {
  sm: "px-3 py-2",
  md: "px-4 py-3",
  lg: "px-5 py-3.5",
};

/** Text rung per size, applied to the bubble's `<text>`. */
const textClass: Record<ChatBubbleSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/**
 * Figma `Chat bubble` (64:359): 16/12px padding, 20px radius, body-md text.
 *
 * `me` bubbles push to the right edge with the ink fill, `bot` bubbles stay left on the subtle fill;
 * both cap at 560px or the parent's width and rise in with `motion-rise`. Lynx has no `wrap-break-word`
 * utility (`overflow-wrap` is not in the supported property set), so a long unbroken token is broken with
 * `break-all`, which Lynx's `word-break` does support.
 *
 * @example
 * ```tsx
 * import { ChatBubble } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-col gap-2">
 *       <ChatBubble from="bot">What should I look up?</ChatBubble>
 *       <ChatBubble from="me">The Q3 usage report, please.</ChatBubble>
 *     </view>
 *   );
 * }
 * ```
 */
export function ChatBubble({ from = "me", size = "md", className, children }: ChatBubbleProps) {
  return (
    <view
      className={cn(
        "motion-rise w-fit max-w-[560px] flex-row break-all rounded-xl",
        sizeClass[size],
        from === "me" ? "ml-auto bg-interactive-primary" : "bg-bg-subtle",
        className,
      )}
    >
      <text
        className={cn(
          "text-trim",
          textClass[size],
          from === "me" ? "text-interactive-on-primary" : "text-text-primary",
        )}
      >
        {children}
      </text>
    </view>
  );
}
