import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Avatar } from "./avatar";

export type BotListRowProps = Omit<ComponentProps<"button">, "className"> & {
  name: ReactNode;
  /** Last activity time, such as "8:41 AM". */
  time?: ReactNode;
  /** One-line preview of the latest activity. */
  preview?: ReactNode;
  /** Running bots show the live dot on the avatar. */
  live?: boolean;
  selected?: boolean;
  className?: string;
};

/** Figma `Bot list row` (64:456): a flat 12px-padded row; hover 5% ink, selected 10% ink. */
export function BotListRow({ name, time, preview, live, selected, className, ...props }: BotListRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex w-full motion-press cursor-pointer items-center gap-3 rounded-lg p-3 text-left",
        selected ? "bg-overlay-ink-10" : "hover:bg-overlay-ink-5",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      <Avatar type="bot" size="lg" live={live} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{name}</span>
          {time && <span className="shrink-0 text-caption text-text-secondary">{time}</span>}
        </span>
        {preview && <span className="truncate text-body-sm text-text-secondary">{preview}</span>}
      </span>
    </button>
  );
}
