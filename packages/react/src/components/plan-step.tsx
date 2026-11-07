import { ArrowClockwise, Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/**
 * State of one step in a plan.
 *
 * - `done` — finished: sky marker with a check and a sky rail running to the next step.
 * - `running` — in progress: spinner on a subtle fill.
 * - `failed` — stopped with an error: danger marker with `!` and the error line expanded.
 * - `pending` — not started: outlined marker that shows the step number.
 */
export type PlanStepStatus = "done" | "running" | "failed" | "pending";

/**
 * Props for {@link PlanStep}. Only `status`, `index` and `title` are required; everything else is
 * optional decoration around the marker and the title line.
 */
export type PlanStepProps = {
  /** Current step state; drives the marker glyph, the marker fill and the rail color. */
  status: PlanStepStatus;
  /** Step number, shown on pending steps. */
  index: number;
  /** Step title; primary while done, running or failed, secondary while pending. */
  title: ReactNode;
  /** Secondary line under the title, next to the tool tag. */
  description?: ReactNode;
  /** Tool id in mono, such as "stripe.query". */
  tool?: ReactNode;
  /** Timing label at the right of the title; rendered only while `done` or `running`. */
  elapsed?: ReactNode;
  /** Error line under the title, revealed only when `status` is `failed`. */
  error?: ReactNode;
  /** Adds a "Retry from here" button in the expanded error block; it is inert unless `status` is `failed`. */
  onRetry?: () => void;
  /** Hides the rail line under the last step. */
  last?: boolean;
  /** Classes merged onto the outer row. */
  className?: string;
};

/**
 * Figma `Plan step` (Agent plan 191:8296): a 24px marker on a 2px rail, sky when done.
 *
 * Stack the steps of an agent plan vertically and pass `last` to the final one so the rail stops
 * there. The marker cross-fades on every status change, and the error block collapses unless the
 * step failed.
 *
 * @example
 * ```tsx
 * import { PlanStep } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <div>
 *       <PlanStep status="done" index={1} title="Read the brief" elapsed="2s" />
 *       <PlanStep status="running" index={2} title="Search the web" tool="web.search" />
 *       <PlanStep status="pending" index={3} title="Write the summary" last />
 *     </div>
 *   );
 * }
 * ```
 */
export function PlanStep({
  status,
  index,
  title,
  description,
  tool,
  elapsed,
  error,
  onRetry,
  last,
  className,
}: PlanStepProps) {
  return (
    <div className={cn("flex min-w-0 items-stretch gap-3.5", className)}>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md text-label-sm motion-colors",
            status === "done" && "bg-status-live text-interactive-on-primary",
            status === "failed" && "bg-bg-danger text-text-danger",
            status === "pending" && "border border-border-default text-text-secondary",
            status === "running" && "bg-bg-subtle",
          )}
        >
          <span key={status} className="flex animate-pop-in items-center justify-center">
            {status === "done" && <Check aria-hidden className="size-3.5" />}
            {status === "running" && <Spinner size={20} />}
            {status === "failed" && "!"}
            {status === "pending" && index}
          </span>
        </span>
        {!last && (
          <span
            className={cn(
              "w-0.5 flex-1 rounded-[1px] motion-colors",
              status === "done" ? "bg-status-live" : "bg-border-default",
            )}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col pt-0.5 pb-4.5">
        <div className="flex items-start gap-3">
          <p
            className={cn(
              "min-w-0 flex-1 text-label-lg wrap-break-word",
              status === "pending" ? "text-text-secondary" : "text-text-primary",
            )}
          >
            {title}
          </p>
          {elapsed && (status === "done" || status === "running") && (
            <span className="shrink-0 text-caption text-text-secondary">{elapsed}</span>
          )}
        </div>
        <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
          {description && (
            <span className="min-w-0 text-body-sm wrap-break-word text-text-secondary">{description}</span>
          )}
          {tool && (
            <span className="rounded-xs bg-bg-subtle px-2 py-0.5 font-mono text-label-md text-text-secondary">
              {tool}
            </span>
          )}
        </div>
        <div className="motion-reveal" data-collapsed={status !== "failed" || undefined}>
          <div>
            <div className="mt-1.5 flex flex-col gap-1.5">
              <p className="text-body-sm wrap-break-word text-text-danger">{error}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  inert={status !== "failed"}
                  className="flex h-7.5 w-fit motion-press cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
                >
                  <ArrowClockwise aria-hidden className="size-3.5" />
                  Retry from here
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
