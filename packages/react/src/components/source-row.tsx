import { Check, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/**
 * Overall state of an indexed source: `ready` when every stage finished, `indexing` while the
 * pipeline runs, and `failed` when a stage broke and Retry is offered.
 */
export type SourceStatus = "ready" | "indexing" | "failed";

/** Props of {@link SourceRow}: the source's identity, its pipeline state and the Retry action. */
export type SourceRowProps = {
  /** Drives the default stage states, the detail color and which trailing control appears. */
  status: SourceStatus;
  /** 16px source icon on the 32px tile. */
  icon: ReactNode;
  /** Source name, one truncated line at `label-md`. */
  name: ReactNode;
  /** Pages and chunks, progress, or the error. */
  detail: ReactNode;
  /** 0-100 while indexing. @default 0 */
  progress?: number;
  /** Called by the Retry button, which only appears when `status` is `failed`. */
  onRetry?: () => void;
  /** `card` is a standalone subtle row; `list` is transparent with a 1px divider, for stacking inside a list. @default "card" */
  variant?: "card" | "list";
  /** Pipeline stage states; defaults to Parse, Chunk, Embed, Index derived from `status`. @default `defaultStages[status]`: `ready` is all `done`, `indexing` is `done, done, active, todo`, `failed` is `done, done, failed, todo` */
  stages?: SourceStages;
  /** Extra classes on the row, which owns the radius, border or divider. */
  className?: string;
};

/**
 * One stage of the parse → chunk → embed → index pipeline: `done` is a 35% ink bar, `active`
 * shows the live progress fill, `todo` is 8% ink and `failed` takes the red accent.
 */
export type SourceStage = "done" | "active" | "todo" | "failed";

/** The four pipeline stages in display order: parse, chunk, embed, index. */
export type SourceStages = [SourceStage, SourceStage, SourceStage, SourceStage];
const stageNames = ["parse", "chunk", "embed", "index"] as const;

const defaultStages: Record<SourceStatus, SourceStages> = {
  ready: ["done", "done", "done", "done"],
  indexing: ["done", "done", "active", "todo"],
  failed: ["done", "done", "failed", "todo"],
};

const stageFill = { done: "bg-overlay-ink-35", todo: "bg-overlay-ink-8", failed: "bg-accent-red-500-90" } as const;
const stage = (state: keyof typeof stageFill) =>
  cn("h-[3px] w-6 overflow-clip rounded-full transition-colors duration-150 sm:w-11", stageFill[state]);

/**
 * Figma `Source row` (Knowledge base): a flat row with a four-stage pipeline (parse, chunk, embed, index).
 *
 * The four 24px stage bars (44px from `sm` up) show the pipeline; the `active` bar fills to
 * `progress`. The trailing slot is state-specific: a check when ready, a live percentage while
 * indexing, and a Retry button when failed, where the detail line turns danger red with a warning icon.
 *
 * @example
 * ```tsx
 * import { FilePdf } from "@phosphor-icons/react";
 * import { SourceRow } from "@horon-ai/react";
 *
 * function IndexingSource() {
 *   return (
 *     <SourceRow
 *       status="indexing"
 *       icon={<FilePdf />}
 *       name="Q4 launch brief.pdf"
 *       detail="42 pages · embedding"
 *       progress={68}
 *     />
 *   );
 * }
 * ```
 */
export function SourceRow({
  status,
  icon,
  name,
  detail,
  progress = 0,
  onRetry,
  variant = "card",
  stages = defaultStages[status],
  className,
}: SourceRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 px-2 py-3",
        variant === "list"
          ? "relative after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-overlay-ink-8 last:after:hidden"
          : "rounded-[14px] border border-border-default bg-bg-surface px-3",
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-overlay-ink-5 text-text-primary [&>svg]:size-4">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        <span
          className={cn(
            "flex items-center gap-1 text-caption",
            status === "failed" ? "text-text-danger" : "text-text-secondary",
          )}
        >
          {status === "failed" && <WarningCircle aria-hidden className="size-3 shrink-0" />}
          <span className="truncate">{detail}</span>
        </span>
      </span>
      <span aria-hidden className="flex shrink-0 items-center gap-1">
        {stages.map((state, i) => {
          const stageName = stageNames[i];
          return state === "active" ? (
            <span key={stageName} className={stage("todo")}>
              <span
                className="block h-full rounded-full bg-status-live transition-[width] duration-400 ease-out-quint"
                style={{ width: `${progress}%` }}
              />
            </span>
          ) : (
            <span key={stageName} className={stage(state)} />
          );
        })}
      </span>
      <span className="flex h-7.5 w-18 shrink-0 items-center justify-end">
        {status === "ready" && <Check aria-label="Ready" className="size-4 text-text-secondary" />}
        {status === "indexing" && (
          <span className="w-9 text-right text-label-md text-text-secondary tabular-nums">
            <span key={progress} className="inline-block animate-fade-in">
              {progress}%
            </span>
          </span>
        )}
        {status === "failed" && (
          <button
            type="button"
            onClick={onRetry}
            className="flex h-7.5 motion-press cursor-pointer items-center rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            Retry
          </button>
        )}
      </span>
    </div>
  );
}
