import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
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
  running: "bg-interactive-primary",
  done: "bg-interactive-primary",
  review: "bg-sky-500",
  failed: "bg-sky-700",
};

/** React painted the initial through the inherited row color; Lynx colors each `<text>` itself. */
const botTileText: Record<TaskStatus, string> = {
  running: "text-interactive-on-primary",
  done: "text-interactive-on-primary",
  review: "text-sky-50",
  failed: "text-sky-50",
};

const pill =
  "flex h-[30px] shrink-0 flex-row items-center justify-center gap-1.5 rounded-full px-3 motion-press";

/** The spring and quint curves the status glyphs enter on, written out for an inline animation. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

const popIn = {
  animationName: "pop-in",
  animationDuration: "220ms",
  animationTimingFunction: EASE_SPRING,
  animationFillMode: "both",
} as const;

const fadeIn = {
  animationName: "fade-in",
  animationDuration: "160ms",
  animationTimingFunction: "var(--ease-out-quint)",
  animationFillMode: "both",
} as const;

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/**
 * Figma `Task row` (Agent tasks 112:939): a flat subtle row, 16px radius, with Running / Review / Failed / Done.
 *
 * The status drives the icon, the message color and the one primary action offered: Cancel while
 * running, Retry when failed, Review when waiting for a person, and Archive once review or done.
 * Every state change animates in with the shared pop/fade motion.
 *
 * Lynx has no `::after` and no `:last-child`, so the `list` variant paints its divider as a real
 * view pinned to the row's bottom edge, and only the action the status asks for is mounted instead
 * of crossfading a stack of them.
 *
 * @example
 * ```tsx
 * import { TaskRow } from "@horon-ai/lynx";
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
    <view
      className={cn(
        "flex flex-col gap-2 px-4 py-3.5",
        variant === "list" ? "relative" : "rounded-2xl border border-border-default bg-bg-surface",
        className,
      )}
    >
      {variant === "list" ? (
        <view className="absolute inset-x-4 bottom-0 h-px bg-overlay-ink-8" accessibility-element={false} />
      ) : null}
      <view className="flex flex-row items-center gap-2">
        {isPlainText(title) ? (
          <text className="min-w-0 grow truncate text-label-lg text-text-primary">{title}</text>
        ) : (
          <view className="min-w-0 grow">{title}</view>
        )}
        {elapsed ? (
          isPlainText(elapsed) ? (
            <text className="shrink-0 text-caption text-text-secondary">{elapsed}</text>
          ) : (
            <view className="shrink-0">{elapsed}</view>
          )
        ) : null}
      </view>
      <view className="flex flex-row items-center gap-1.5">
        <view
          className={cn(
            "flex size-[18px] shrink-0 flex-row items-center justify-center rounded-[5px]",
            bot.tileClassName ?? botTile[status],
          )}
        >
          <text className={cn("text-label-sm text-trim", bot.tileClassName ? "text-text-inverse" : botTileText[status])}>
            {bot.initial}
          </text>
        </view>
        {isPlainText(bot.name) ? (
          <text className="whitespace-nowrap text-caption text-text-secondary">{bot.name}</text>
        ) : (
          bot.name
        )}
        {project ? (
          <>
            <text className="text-caption text-text-secondary">·</text>
            <Icon name="Folder" size={14} color="text-secondary" />
            {isPlainText(project) ? (
              <text className="truncate text-caption text-text-secondary">{project}</text>
            ) : (
              project
            )}
          </>
        ) : null}
      </view>
      <view className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1.5 pt-0.5">
        <view className="flex size-4 shrink-0 flex-row items-center justify-center" accessibility-element={false}>
          {status === "running" ? <Spinner key="running" size={15} /> : null}
          {status === "review" ? (
            <view key="review" style={popIn}>
              <Icon name="CheckCircle" size={16} color="text-primary" />
            </view>
          ) : null}
          {status === "done" ? (
            <view key="done" style={popIn}>
              <Icon name="CheckCircle" size={16} color="text-secondary" />
            </view>
          ) : null}
          {status === "failed" ? (
            <view key="failed" style={popIn}>
              <Icon name="WarningCircle" size={16} color="text-danger" />
            </view>
          ) : null}
        </view>
        {isPlainText(message) ? (
          <text
            key={status}
            className={cn(
              "min-w-0 truncate text-label-md motion-colors",
              status === "failed" ? "text-text-danger" : status === "done" ? "text-text-secondary" : "text-text-primary",
            )}
            style={fadeIn}
          >
            {message}
          </text>
        ) : (
          <view key={status} style={fadeIn}>
            {message}
          </view>
        )}
        {detail ? (
          <>
            <text className="text-caption text-text-secondary">·</text>
            {isPlainText(detail) ? (
              <text className="min-w-0 truncate text-caption text-text-secondary">{detail}</text>
            ) : (
              detail
            )}
          </>
        ) : null}
        <view className="min-w-0 grow" />
        {status === "running" ? (
          <view
            className={cn(pill, "bg-overlay-ink-6")}
            style={popIn}
            bindtap={onCancel}
            accessibility-element
            accessibility-traits="button"
          >
            <Icon name="Stop" size={14} color="text-primary" />
            <text className="text-label-sm text-text-primary">Cancel</text>
          </view>
        ) : null}
        {status === "failed" ? (
          <view
            className={cn(pill, "bg-overlay-ink-6")}
            style={popIn}
            bindtap={onRetry}
            accessibility-element
            accessibility-traits="button"
          >
            <Icon name="ArrowClockwise" size={14} color="text-primary" />
            <text className="text-label-sm text-text-primary">Retry</text>
          </view>
        ) : null}
        {status === "review" ? (
          <view
            className={cn(pill, "bg-interactive-primary")}
            style={popIn}
            bindtap={onReview}
            accessibility-element
            accessibility-traits="button"
          >
            <text className="text-label-sm text-text-inverse">Review</text>
          </view>
        ) : null}
        {status === "review" || status === "done" ? (
          <view
            className="flex size-[30px] shrink-0 flex-row items-center justify-center rounded-full motion-press"
            style={popIn}
            bindtap={onArchive}
            accessibility-element
            accessibility-traits="button"
            accessibility-label="Archive"
          >
            <Icon name="Archive" size={16} color="text-secondary" />
          </view>
        ) : null}
      </view>
    </view>
  );
}
