import { CaretDown, CaretRight, CheckCircle, WarningCircle, Wrench } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/** Figma `Thinking` (Agent activity 108:660): a 69x31 subtle pill with three 7px dots at 35/55/80% ink. */
export function ThinkingIndicator({ label = "Thinking", className }: { label?: string; className?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex h-7.75 w-17.25 items-center justify-center gap-2 rounded-full bg-bg-subtle",
        className,
      )}
    >
      <span className="size-[7px] animate-thinking rounded-full bg-overlay-ink-35" />
      <span className="size-[7px] animate-thinking rounded-full bg-overlay-ink-55 [animation-delay:150ms]" />
      <span className="size-[7px] animate-thinking rounded-full bg-overlay-ink-80 [animation-delay:300ms]" />
    </span>
  );
}

/** Figma `Streaming` (108:660): a flat bot bubble with body-sm text and a 2x16 ink caret. */
export function StreamingText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "flex w-fit items-end gap-2 rounded-xl bg-bg-subtle px-4 py-3 text-body-sm text-text-primary",
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden className="mb-[3px] h-4 w-0.5 shrink-0 animate-caret rounded-[1px] bg-interactive-primary" />
    </div>
  );
}

export type ToolStepState = "running" | "done" | "failed";

export type ToolStepProps = Omit<ComponentProps<"button">, "className" | "title"> & {
  state?: ToolStepState;
  title: ReactNode;
  detail?: ReactNode;
  className?: string;
};

/** Figma `Tool step` (108:660): a flat 12px-radius row with spinner, check or warning, and a caret. */
export function ToolStep({ state = "running", title, detail, className, ...props }: ToolStepProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full motion-press cursor-pointer items-center gap-2.5 rounded-md bg-bg-subtle px-2.5 py-2 text-left focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {state === "running" && <Spinner size="sm" />}
      {state === "done" && <CheckCircle aria-hidden className="size-4 shrink-0 text-text-secondary" />}
      {state === "failed" && <WarningCircle aria-hidden className="size-4 shrink-0 text-text-danger" />}
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className={cn("truncate text-label-md", state === "failed" ? "text-text-danger" : "text-text-primary")}>
          {title}
        </span>
        {detail && <span className="truncate text-caption text-text-secondary">{detail}</span>}
      </span>
      <CaretRight aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
    </button>
  );
}

export type WorkLogStep = { id: string; title: ReactNode; detail?: ReactNode; running?: boolean };

/** Figma `Work log` (108:660): a flat subtle card with a wrench summary row and compact steps. */
export function WorkLog({
  summary,
  steps,
  className,
}: {
  summary: ReactNode;
  steps: WorkLogStep[];
  className?: string;
}) {
  return (
    <details open className={cn("group flex w-85 flex-col rounded-[16px] bg-bg-subtle p-1.5", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-2.5 py-1.5 text-caption text-text-secondary [&::-webkit-details-marker]:hidden">
        <Wrench aria-hidden className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1">{summary}</span>
        <CaretDown
          aria-hidden
          className="size-3.5 shrink-0 transition-transform duration-200 ease-out-quint group-not-open:-rotate-90"
        />
      </summary>
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2.5 px-2.5 py-1.5">
          {step.running ? (
            <Spinner size="xs" />
          ) : (
            <CheckCircle aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
          )}
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-label-sm text-text-primary">{step.title}</span>
            {step.detail && <span className="truncate text-caption text-text-secondary">{step.detail}</span>}
          </span>
        </div>
      ))}
    </details>
  );
}
