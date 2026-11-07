import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
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

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/** The Figma spring (`--ease-spring`), written out because an inline animation cannot read a variable. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/** Restarts on every status change, so the new marker glyph pops in instead of swapping in place. */
const popIn = {
  animationName: "pop-in",
  animationDuration: "220ms",
  animationTimingFunction: EASE_SPRING,
  animationFillMode: "both",
} as const;

/**
 * Figma `Plan step` (Agent plan 191:8296): a 24px marker on a 2px rail, sky when done.
 *
 * Stack the steps of an agent plan vertically and pass `last` to the final one so the rail stops
 * there. The marker cross-fades on every status change, and the error block collapses unless the
 * step failed.
 *
 * Lynx has no `<p>`, no pseudo-elements and no `:last-child`, so the marker, the rail and the
 * retry pill are `view`/`text` pairs, the status glyph is keyed on `status` to replay its entry
 * animation, and the error block is rendered only when the step failed instead of collapsing to
 * height 0.
 *
 * @example
 * ```tsx
 * import { PlanStep } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-col">
 *       <PlanStep status="done" index={1} title="Read the brief" elapsed="2s" />
 *       <PlanStep status="running" index={2} title="Search the web" tool="web.search" />
 *       <PlanStep status="pending" index={3} title="Write the summary" last />
 *     </view>
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
    <view className={cn("flex min-w-0 flex-row items-stretch gap-3.5", className)}>
      <view className="flex shrink-0 flex-col items-center gap-1">
        <view
          className={cn(
            "flex size-6 shrink-0 flex-row items-center justify-center rounded-md motion-colors",
            status === "done" && "bg-status-live",
            status === "failed" && "bg-bg-danger",
            status === "pending" && "border border-border-default",
            status === "running" && "bg-bg-subtle",
          )}
        >
          <view key={status} className="flex flex-row items-center justify-center" style={popIn}>
            {status === "done" && <Icon name="Check" size={14} color="interactive-on-primary" />}
            {status === "running" && <Spinner size={20} />}
            {status === "failed" && <text className="text-label-sm text-text-danger">!</text>}
            {status === "pending" && <text className="text-label-sm text-text-secondary">{index}</text>}
          </view>
        </view>
        {last ? null : (
          <view
            className={cn(
              "w-0.5 grow rounded-[1px] motion-colors",
              status === "done" ? "bg-status-live" : "bg-border-default",
            )}
          />
        )}
      </view>
      <view className="flex min-w-0 grow flex-col pt-0.5 pb-[18px]">
        <view className="flex flex-row items-start gap-3">
          {isPlainText(title) ? (
            <text
              className={cn(
                "min-w-0 grow text-label-lg break-all",
                status === "pending" ? "text-text-secondary" : "text-text-primary",
              )}
            >
              {title}
            </text>
          ) : (
            <view className="min-w-0 grow">{title}</view>
          )}
          {elapsed && (status === "done" || status === "running") ? (
            isPlainText(elapsed) ? (
              <text className="shrink-0 text-caption text-text-secondary">{elapsed}</text>
            ) : (
              <view className="shrink-0">{elapsed}</view>
            )
          ) : null}
        </view>
        <view className="mt-1.5 flex min-w-0 flex-row flex-wrap items-center gap-x-2 gap-y-1.5">
          {description ? (
            isPlainText(description) ? (
              <text className="min-w-0 text-body-sm break-all text-text-secondary">{description}</text>
            ) : (
              <view className="min-w-0">{description}</view>
            )
          ) : null}
          {tool ? (
            <view className="rounded-xs bg-bg-subtle px-2 py-0.5">
              {isPlainText(tool) ? (
                <text className="font-mono text-label-md text-text-secondary">{tool}</text>
              ) : (
                tool
              )}
            </view>
          ) : null}
        </view>
        {status === "failed" ? (
          <view className="mt-1.5 flex flex-col gap-1.5">
            {error ? (
              isPlainText(error) ? (
                <text className="text-body-sm break-all text-text-danger">{error}</text>
              ) : (
                error
              )
            ) : null}
            {onRetry ? (
              <view
                className="flex h-[30px] w-fit flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 px-3 motion-press"
                bindtap={onRetry}
                accessibility-element
                accessibility-traits="button"
              >
                <Icon name="ArrowClockwise" size={14} color="text-primary" />
                <text className="text-label-sm text-text-primary">Retry from here</text>
              </view>
            ) : null}
          </view>
        ) : null}
      </view>
    </view>
  );
}
