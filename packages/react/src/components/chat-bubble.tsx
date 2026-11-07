import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/** Padding and text rung of {@link ChatBubble}; identical to {@link ControlSize}. */
export type ChatBubbleSize = ControlSize;

/** Props of {@link ChatBubble}. */
export type ChatBubbleProps = Omit<ComponentProps<"div">, "className"> & {
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
};

const sizeClass: Record<ChatBubbleSize, string> = {
  sm: "px-3 py-2 text-body-sm",
  md: "px-4 py-3 text-body-md",
  lg: "px-5 py-3.5 text-body-lg",
};

/**
 * Figma `Chat bubble` (64:359): 16/12px padding, 20px radius, body-md text.
 *
 * `me` bubbles push to the right edge with the ink fill, `bot` bubbles stay left on the subtle fill;
 * both cap at 560px or the parent's width, wrap long words and rise in with `motion-rise`. The `from`
 * value is mirrored to `data-from` for styling hooks.
 *
 * @example
 * ```tsx
 * import { ChatBubble } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <div className="flex flex-col gap-2">
 *       <ChatBubble from="bot">What should I look up?</ChatBubble>
 *       <ChatBubble from="me">The Q3 usage report, please.</ChatBubble>
 *     </div>
 *   );
 * }
 * ```
 */
export function ChatBubble({ from = "me", size = "md", className, ...props }: ChatBubbleProps) {
  return (
    <div
      data-from={from}
      className={cn(
        "w-fit max-w-[min(100%,560px)] motion-rise rounded-xl wrap-break-word",
        sizeClass[size],
        from === "me" ? "ml-auto bg-interactive-primary text-interactive-on-primary" : "bg-bg-subtle text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
