import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type ChatBubbleSize = ControlSize;

export type ChatBubbleProps = Omit<ComponentProps<"div">, "className"> & {
  /** `me` is the ink bubble, `bot` the flat subtle bubble. Neither uses glass. */
  from?: "me" | "bot";
  /** Bubble size: `sm` 12/8px padding with body-sm, `md` 16/12px with body-md (default), `lg` 20/14px with body-lg. */
  size?: ChatBubbleSize;
  className?: string;
};

const sizeClass: Record<ChatBubbleSize, string> = {
  sm: "px-3 py-2 text-body-sm",
  md: "px-4 py-3 text-body-md",
  lg: "px-5 py-3.5 text-body-lg",
};

/** Figma `Chat bubble` (64:359): 16/12px padding, 20px radius, body-md text. */
export function ChatBubble({ from = "me", size = "md", className, ...props }: ChatBubbleProps) {
  return (
    <div
      data-from={from}
      className={cn(
        "w-fit max-w-[min(100%,560px)] animate-[tab-panel-in_220ms_var(--ease-out-quint)] rounded-xl",
        sizeClass[size],
        from === "me" ? "ml-auto bg-interactive-primary text-interactive-on-primary" : "bg-bg-subtle text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
