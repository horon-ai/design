import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

export type ChatBubbleProps = Omit<ComponentProps<"div">, "className"> & {
  /** `me` is the ink bubble, `bot` the flat subtle bubble. Neither uses glass. */
  from?: "me" | "bot";
  className?: string;
};

/** Figma `Chat bubble` (64:359): 16/12px padding, 20px radius, body-md text. */
export function ChatBubble({ from = "me", className, ...props }: ChatBubbleProps) {
  return (
    <div
      data-from={from}
      className={cn(
        "w-fit max-w-[min(100%,560px)] rounded-xl px-4 py-3 text-body-md",
        from === "me" ? "ml-auto bg-interactive-primary text-interactive-on-primary" : "bg-bg-subtle text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
