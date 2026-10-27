import { Archive, ArrowClockwise, CaretDown, CheckCircle, Folder, Stop, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type TaskStatus = "running" | "review" | "failed" | "done";

export type TaskRowProps = {
  status: TaskStatus;
  title: ReactNode;
  /** Elapsed time, such as "1m 56s". */
  elapsed?: ReactNode;
  /** Bot initial and name. */
  bot: { initial: string; name: ReactNode; tileClassName?: string };
  project?: ReactNode;
  /** Status line: the current step, the result or the error. */
  message: ReactNode;
  /** Caption after the message, such as "2 drafts · 1 calendar change". */
  detail?: ReactNode;
  onCancel?: () => void;
  onRetry?: () => void;
  onReview?: () => void;
  onArchive?: () => void;
  /** `card` is a standalone subtle row; `list` is transparent with a 1px divider, for stacking inside a list. */
  variant?: "card" | "list";
  className?: string;
};

const botTile: Record<TaskStatus, string> = {
  running: "bg-interactive-primary",
  done: "bg-interactive-primary",
  review: "bg-sky-500",
  failed: "bg-sky-700",
};

const pill =
  "motion-press flex h-7.5 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-label-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand";

/** Figma `Task row` (Agent tasks 112:939): a flat subtle row, 16px radius, with Running / Review / Failed / Done. */
export function TaskRow({
  status,
  title,
  elapsed,
  bot,
  project,
  message,
  detail,
  onCancel,
  onRetry,
  onReview,
  onArchive,
  variant = "card",
  className,
}: TaskRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-4 py-3.5",
        variant === "list"
          ? "relative rounded-b-[16px] after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-overlay-ink-8 last:after:hidden"
          : "rounded-[16px] bg-bg-subtle",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</p>
        {elapsed && <span className="shrink-0 text-caption text-text-secondary">{elapsed}</span>}
        <CaretDown aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
      </div>
      <div className="flex items-center gap-1.5 text-caption text-text-secondary">
        <span
          className={cn(
            "flex size-4.5 shrink-0 items-center justify-center rounded-[5px] text-label-sm text-text-inverse",
            bot.tileClassName ?? botTile[status],
          )}
        >
          {bot.initial}
        </span>
        <span className="whitespace-nowrap">{bot.name}</span>
        {project && (
          <>
            <span aria-hidden>·</span>
            <Folder aria-hidden className="size-[13px] shrink-0" />
            <span className="truncate">{project}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 pt-0.5">
        {status === "running" && <Spinner size={15} />}
        {status === "review" && <CheckCircle aria-hidden className="size-4 shrink-0 text-text-primary" />}
        {status === "done" && <CheckCircle aria-hidden className="size-4 shrink-0 text-text-secondary" />}
        {status === "failed" && <WarningCircle aria-hidden className="size-4 shrink-0 text-text-danger" />}
        <span
          className={cn(
            "shrink-0 text-label-md whitespace-nowrap motion-colors",
            status === "failed" ? "text-text-danger" : status === "done" ? "text-text-secondary" : "text-text-primary",
          )}
        >
          {message}
        </span>
        {detail && <span className="min-w-0 truncate text-caption text-text-secondary">{detail}</span>}
        <span className="flex-1" />
        {status === "running" && (
          <button type="button" onClick={onCancel} className={cn(pill, "bg-overlay-ink-6 text-text-primary")}>
            <Stop aria-hidden className="size-3.5" />
            Cancel
          </button>
        )}
        {status === "failed" && (
          <button type="button" onClick={onRetry} className={cn(pill, "bg-overlay-ink-6 text-text-primary")}>
            <ArrowClockwise aria-hidden className="size-3.5" />
            Retry
          </button>
        )}
        {status === "review" && (
          <button type="button" onClick={onReview} className={cn(pill, "bg-interactive-primary text-text-inverse")}>
            Review
          </button>
        )}
        {(status === "review" || status === "done") && (
          <button
            type="button"
            aria-label="Archive"
            onClick={onArchive}
            className="flex size-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary hover:bg-overlay-ink-6 focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <Archive aria-hidden className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
