import { CaretLeft, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

export type TopBarProps = Omit<ComponentProps<"header">, "className" | "title"> & {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Shows the live status dot on the avatar. */
  live?: boolean;
  onBack?: () => void;
  onMore?: () => void;
  backLabel?: string;
  moreLabel?: string;
  className?: string;
};

/** Paper `Top bar`: back button, bot avatar with a flush live dot, title and subtitle, more button on regular glass. */
export function TopBar({
  title,
  subtitle,
  live,
  onBack,
  onMore,
  backLabel = "Back",
  moreLabel = "More",
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      className={cn("relative z-10 flex items-center gap-2 overflow-clip rounded-full bg-glass-regular p-2", className)}
      {...props}
    >
      <LiquidGlass tier="regular" />
      <IconButton icon={<CaretLeft />} label={backLabel} onClick={onBack} />
      <span className="relative inline-flex shrink-0">
        <Avatar type="bot" size="md" />
        {live && (
          <span aria-hidden className="absolute right-0 bottom-0 flex animate-pop-in">
            <span className="size-[9px] animate-live-pulse rounded-full bg-status-live text-status-live" />
          </span>
        )}
      </span>
      <div className="relative flex min-w-0 flex-1 flex-col overflow-clip">
        <span className="truncate text-label-lg text-text-primary">{title}</span>
        {subtitle && <span className="truncate text-caption text-text-secondary">{subtitle}</span>}
      </div>
      <IconButton icon={<DotsThree weight="bold" />} label={moreLabel} onClick={onMore} />
    </header>
  );
}
