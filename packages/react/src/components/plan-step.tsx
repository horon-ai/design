import { ArrowClockwise, Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type PlanStepStatus = "done" | "running" | "failed" | "pending";

export type PlanStepProps = {
  status: PlanStepStatus;
  /** Step number, shown on pending steps. */
  index: number;
  title: ReactNode;
  description?: ReactNode;
  /** Tool id in mono, such as "stripe.query". */
  tool?: ReactNode;
  elapsed?: ReactNode;
  error?: ReactNode;
  onRetry?: () => void;
  /** Hides the rail line under the last step. */
  last?: boolean;
  className?: string;
};

/** Figma `Plan step` (Agent plan 191:8296): a 24px marker on a 2px rail, sky when done. */
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
    <div className={cn("flex items-stretch gap-3.5", className)}>
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
              "min-w-0 flex-1 text-label-lg",
              status === "pending" ? "text-text-secondary" : "text-text-primary",
            )}
          >
            {title}
          </p>
          {elapsed && (status === "done" || status === "running") && (
            <span className="shrink-0 text-caption text-text-secondary">{elapsed}</span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {description && <span className="text-body-sm text-text-secondary">{description}</span>}
          {tool && (
            <span className="rounded-xs bg-bg-subtle px-2 py-0.5 font-mono text-label-md text-text-secondary">
              {tool}
            </span>
          )}
        </div>
        <div className="motion-reveal" data-collapsed={status !== "failed" || undefined}>
          <div>
            <div className="mt-1.5 flex flex-col gap-1.5">
              <p className="text-body-sm text-text-danger">{error}</p>
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
