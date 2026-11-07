import { CaretLeft, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props for {@link TopBar}.
 */
export type TopBarProps = Omit<ComponentProps<"header">, "className" | "title"> & {
  /** Bar title; truncates to one line and re-runs the fade-in when the text changes. */
  title: ReactNode;
  /** Second line under the title, muted and truncated. */
  subtitle?: ReactNode;
  /** Shows the live status dot on the avatar. */
  live?: boolean;
  /** Renders the back IconButton on the left and calls this on press; hidden when omitted. */
  onBack?: () => void;
  /** Renders the overflow IconButton on the right and calls this on press; hidden when omitted. */
  onMore?: () => void;
  /** Accessible label of the back button. @default "Back" */
  backLabel?: string;
  /** Accessible label of the overflow button. @default "More" */
  moreLabel?: string;
  /** `solid` (default) is an opaque surface bar with a default border; `glass` is the regular glass bar. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes for the `header` element. */
  className?: string;
};

/**
 * Paper `Top bar`: back button, bot avatar with a flush live dot, title and subtitle, on solid surface or regular glass.
 *
 * Renders a rounded `header` with `rounded-full` corners; the glass variant mounts {@link LiquidGlass}
 * as its first child, so keep the bar inside a positioned parent. Back and overflow buttons only appear
 * when `onBack` / `onMore` are passed, which keeps the bare title layout for read-only screens.
 *
 * @example
 * ```tsx
 * import { TopBar } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <TopBar
 *       title="Research bot"
 *       subtitle="12 tasks today"
 *       live
 *       onBack={() => history.back()}
 *       onMore={() => console.log("more")}
 *     />
 *   );
 * }
 * ```
 */
export function TopBar({
  title,
  subtitle,
  live,
  onBack,
  onMore,
  backLabel = "Back",
  moreLabel = "More",
  surface = "solid",
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      className={cn(
        "relative z-10 flex items-center gap-2 overflow-clip rounded-full p-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      {onBack && <IconButton icon={<CaretLeft />} label={backLabel} onClick={onBack} />}
      <span className="relative inline-flex shrink-0">
        <Avatar type="bot" size="md" />
        {live && (
          <span aria-hidden className="absolute right-0 bottom-0 flex animate-pop-in">
            <span className="size-[9px] animate-live-pulse rounded-full bg-status-live text-status-live" />
          </span>
        )}
      </span>
      <div
        key={typeof title === "string" ? `${title}|${typeof subtitle === "string" ? subtitle : ""}` : undefined}
        className="relative flex min-w-0 flex-1 animate-fade-in flex-col overflow-clip"
      >
        <span className="truncate text-label-lg text-text-primary">{title}</span>
        {subtitle && <span className="truncate text-caption text-text-secondary">{subtitle}</span>}
      </div>
      {onMore && <IconButton icon={<DotsThree weight="bold" />} label={moreLabel} onClick={onMore} />}
    </header>
  );
}
