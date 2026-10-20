import * as React from "react";
import { ArrowDownIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@horon-ai/react/components/button";

function MessageScroller({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-scroller"
      className={cn("group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

function MessageScrollerViewport({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-scroller-viewport"
      className={cn("size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content", className)}
      {...props}
    />
  );
}

function MessageScrollerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col gap-8", className)}
      {...props}
    />
  );
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<"div"> & { scrollAnchor?: boolean }) {
  return (
    <div
      data-slot="message-scroller-item"
      data-scroll-anchor={scrollAnchor ? "" : undefined}
      className={cn("min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]", className)}
      {...props}
    />
  );
}

function MessageScrollerButton({
  className,
  direction = "end",
  variant = "secondary",
  size = "icon-sm",
  children,
  ...props
}: React.ComponentProps<typeof Button> & { direction?: "start" | "end" }) {
  return (
    <Button
      data-slot="message-scroller-button"
      data-direction={direction}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-1/2 -translate-x-1/2 rounded-full border border-border shadow-md data-[direction=end]:bottom-4 data-[direction=start]:top-4 data-[direction=start]:[&_svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span data-slot="message-scroller-button-text" className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </Button>
  );
}

export { MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton };
