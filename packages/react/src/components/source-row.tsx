import { Check, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

export type SourceStatus = "ready" | "indexing" | "failed";

export type SourceRowProps = {
  status: SourceStatus;
  /** 16px source icon on the 32px tile. */
  icon: ReactNode;
  name: ReactNode;
  /** Pages and chunks, progress, or the error. */
  detail: ReactNode;
  /** 0-100 while indexing. */
  progress?: number;
  onRetry?: () => void;
  className?: string;
};

const stageFill = { done: "bg-overlay-ink-35", todo: "bg-overlay-ink-8", failed: "bg-red-500" } as const;
const stage = (state: keyof typeof stageFill) => cn("h-[3px] w-11 overflow-clip rounded-full", stageFill[state]);

/** Figma `Source row` (Knowledge base 114:1287): flat subtle row with a three-stage pipeline (fetch, chunk, embed). */
export function SourceRow({ status, icon, name, detail, progress = 0, onRetry, className }: SourceRowProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-[14px] bg-bg-subtle px-2 py-3", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-overlay-ink-5 text-text-primary [&>svg]:size-4">
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
        <span className={stage("done")} />
        {status === "indexing" ? (
          <span className={stage("todo")}>
            <span className="block h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
          </span>
        ) : (
          <span className={stage(status === "failed" ? "failed" : "done")} />
        )}
        <span className={stage(status === "ready" ? "done" : "todo")} />
      </span>
      <span className="flex h-7.5 w-18 shrink-0 items-center justify-end">
        {status === "ready" && <Check aria-label="Ready" className="size-4 text-text-secondary" />}
        {status === "indexing" && <span className="text-label-md text-text-secondary">{progress}%</span>}
        {status === "failed" && (
          <button
            type="button"
            onClick={onRetry}
            className="flex h-7 cursor-pointer items-center rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            Retry
          </button>
        )}
      </span>
    </div>
  );
}
