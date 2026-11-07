import { Archive, ArrowClockwise, CheckCircle, Folder, Stop, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/**
 * Task lifecycle states a {@link TaskRow} renders: `running` shows a spinner and Cancel,
 * `review` a check and Review, `failed` a warning and Retry, `done` a muted check and Archive.
 */
export type TaskStatus = "running" | "review" | "failed" | "done";

/** Props of {@link TaskRow}: the task's state and texts plus the actions offered for that state. */
export type TaskRowProps = {
  /** Drives the status icon, the message color and which actions appear. */
  status: TaskStatus;
  /** Task name, one truncated line at `label-lg`. */
  title: ReactNode;
  /** Elapsed time, such as "1m 56s". */
  elapsed?: ReactNode;
  /** Bot initial and name. */
  bot: {
    /** One or two characters shown in the 18px tile; falls back to the status color when `tileClassName` is absent. */
    initial: string;
    /** Bot name after the tile, kept on one line. */
    name: ReactNode;
    /** Overrides the status-driven tile fill; the text is forced to `text-inverse` when set. */
    tileClassName?: string;
  };
  /** Project shown after the bot name, separated by a dot and a folder icon. */
  project?: ReactNode;
  /** Status line: the current step, the result or the error. */
  message: ReactNode;
  /** Caption after the message, such as "2 drafts · 1 calendar change". */
  detail?: ReactNode;
  /** Called by the Cancel pill; shown only while `running`. */
  onCancel?: () => void;
  /** Called by the Retry pill; shown only when `failed`. */
  onRetry?: () => void;
  /** Called by the Review pill; shown only when `review`. */
  onReview?: () => void;
  /** Called by the archive icon button; shown when `review` or `done`. */
  onArchive?: () => void;
  /** `card` is a standalone subtle row; `list` is transparent with a 1px divider, for stacking inside a list. @default "card" */
  variant?: "card" | "list";
  /** Extra classes on the row container, which owns the radius and divider. */
  className?: string;
};

const botTile: Record<TaskStatus, string> = {
  running: "bg-interactive-primary text-interactive-on-primary",
  done: "bg-interactive-primary text-interactive-on-primary",
  review: "bg-sky-500 text-sky-50",
  failed: "bg-sky-700 text-sky-50",
};

const pill =
  "motion-press flex h-7.5 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-label-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand";

/**
 * Figma `Task row` (Agent tasks 112:939): a flat subtle row, 16px radius, with Running / Review / Failed / Done.
 *
 * The status drives the icon, the message color and the one primary action offered: Cancel while
 * running, Retry when failed, Review when waiting for a person, and Archive once review or done.
 * Every state change animates in with the shared pop/fade motion.
 *
 * @example
 * ```tsx
 * import { TaskRow } from "@horon-ai/react";
 *
 * function RunningTask() {
 *   return (
 *     <TaskRow
 *       status="running"
 *       title="Draft the Q4 launch note"
 *       elapsed="1m 56s"
 *       bot={{ initial: "H", name: "Horon" }}
 *       project="Launch"
 *       message="Writing the second draft"
 *       detail="2 drafts · 1 calendar change"
 *       onCancel={() => cancelTask("launch-note")}
 *     />
 *   );
 * }
 * ```
 */
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
          ? "relative after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-overlay-ink-8 last:after:hidden"
          : "rounded-2xl border border-border-default bg-bg-surface",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</p>
        {elapsed && <span className="shrink-0 text-caption text-text-secondary">{elapsed}</span>}
      </div>
      <div className="flex items-center gap-1.5 text-caption text-text-secondary">
        <span
          className={cn(
            "flex size-4.5 shrink-0 items-center justify-center rounded-[5px] text-label-sm",
            bot.tileClassName ? cn("text-text-inverse", bot.tileClassName) : botTile[status],
          )}
        >
          <span className="text-trim">{bot.initial}</span>
        </span>
        <span className="whitespace-nowrap">{bot.name}</span>
        {project && (
          <>
            <span aria-hidden>·</span>
            <Folder aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{project}</span>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-0.5">
        <span className="flex size-4 shrink-0 items-center justify-center">
          {status === "running" && <Spinner key="running" size={15} className="animate-pop-in" />}
          {status === "review" && (
            <CheckCircle key="review" aria-hidden className="size-4 animate-pop-in text-text-primary" />
          )}
          {status === "done" && (
            <CheckCircle key="done" aria-hidden className="size-4 animate-pop-in text-text-secondary" />
          )}
          {status === "failed" && (
            <WarningCircle key="failed" aria-hidden className="size-4 animate-pop-in text-text-danger" />
          )}
        </span>
        <span
          key={status}
          className={cn(
            "min-w-0 animate-fade-in truncate text-label-md motion-colors",
            status === "failed" ? "text-text-danger" : status === "done" ? "text-text-secondary" : "text-text-primary",
          )}
        >
          {message}
        </span>
        {detail && (
          <>
            <span aria-hidden>·</span>
            <span className="min-w-0 truncate text-caption text-text-secondary">{detail}</span>
          </>
        )}
        <span className="min-w-0 flex-1" />
        {status === "running" && (
          <button
            type="button"
            onClick={onCancel}
            className={cn(pill, "animate-pop-in bg-overlay-ink-6 text-text-primary")}
          >
            <Stop aria-hidden className="size-3.5" />
            Cancel
          </button>
        )}
        {status === "failed" && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(pill, "animate-pop-in bg-overlay-ink-6 text-text-primary")}
          >
            <ArrowClockwise aria-hidden className="size-3.5" />
            Retry
          </button>
        )}
        {status === "review" && (
          <button
            type="button"
            onClick={onReview}
            className={cn(pill, "animate-pop-in bg-interactive-primary text-text-inverse")}
          >
            Review
          </button>
        )}
        {(status === "review" || status === "done") && (
          <button
            type="button"
            aria-label="Archive"
            onClick={onArchive}
            className="flex size-7.5 shrink-0 motion-press animate-pop-in cursor-pointer items-center justify-center rounded-full text-text-secondary hover:bg-overlay-ink-6 focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <Archive aria-hidden className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
