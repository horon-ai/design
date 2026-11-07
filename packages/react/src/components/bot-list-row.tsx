import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Avatar } from "./avatar";

/** Props for {@link BotListRow}: the bot name, last-activity time and preview, the live and selected states. */
export type BotListRowProps = Omit<ComponentProps<"button">, "className"> & {
  /** Bot display name, truncated with an ellipsis when it does not fit. */
  name: ReactNode;
  /** Last activity time, such as "8:41 AM". */
  time?: ReactNode;
  /** One-line preview of the latest activity. */
  preview?: ReactNode;
  /** Running bots show the live dot on the avatar. */
  live?: boolean;
  /** The row for the bot currently open in the panel; paints the 10% ink selected fill and sets `aria-pressed`. */
  selected?: boolean;
  /** Extra classes merged onto the button, for margins or width overrides. */
  className?: string;
};

/**
 * Figma `Bot list row` (64:456): a flat 12px-padded row; hover 5% ink, selected 10% ink. The whole row is the
 * button, so the accessible name comes from its text content (name, time and preview).
 *
 * @example
 * ```tsx
 * <BotListRow name="Researcher" time="8:41 AM" preview="Pulled the Q3 numbers" live selected />
 * ```
 */
export function BotListRow({ name, time, preview, live, selected, className, ...props }: BotListRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex w-full min-w-0 motion-press cursor-pointer items-center gap-3 rounded-lg p-3 text-left",
        selected ? "bg-overlay-ink-10" : "hover:bg-overlay-ink-5",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      <Avatar type="bot" size="lg" live={live} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{name}</span>
          {time && <span className="shrink-0 text-caption text-text-secondary">{time}</span>}
        </span>
        {preview && <span className="min-w-0 truncate text-body-sm text-text-secondary">{preview}</span>}
      </span>
    </button>
  );
}
