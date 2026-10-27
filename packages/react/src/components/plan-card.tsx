import { Collapsible } from "@base-ui/react/collapsible";
import { ListChecks, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type PlanCardStatus = "running" | "failed";

export type PlanCardProps = {
  /** Label line next to the 16px list icon, such as "Plan · 5 steps". */
  label?: ReactNode;
  title: ReactNode;
  /** `PlanStep`s, stacked without dividers. */
  children?: ReactNode;
  /** Footer state. Unset hides the footer; a change expands or collapses it. */
  status?: PlanCardStatus;
  /** Footer text, such as "Stopped · step 4 failed" or "Running · 1 of 5". */
  statusLabel?: ReactNode;
  elapsed?: ReactNode;
  className?: string;
};

/** Figma `Plan card` (Agents N3): a 20px-radius solid card with a label, title, the steps and a status footer. */
export function PlanCard({ label, title, children, status, statusLabel, elapsed, className }: PlanCardProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
    >
      <header className="flex flex-col gap-2 px-6 pt-5 pb-3.5">
        {label && (
          <div className="flex items-center gap-2 text-body-sm text-text-secondary">
            <ListChecks aria-hidden className="size-4 shrink-0" />
            {label}
          </div>
        )}
        <h3 className="text-label-lg text-text-primary">{title}</h3>
      </header>
      <div className="flex flex-col px-6 pt-1.5 pb-1">{children}</div>
      <Collapsible.Root open={status !== undefined}>
        <Collapsible.Panel keepMounted className="motion-collapse">
          <div className="h-px bg-border-default" />
          <div
            className={cn(
              "motion-colors flex items-center gap-2 px-6 pt-3.5 pb-4 text-label-md",
              status === "failed" ? "text-text-danger" : "text-text-primary",
            )}
          >
            {status === "running" && <Spinner size={14} />}
            {status === "failed" && <WarningCircle aria-hidden className="size-4 shrink-0" />}
            <span className="min-w-0 flex-1">{statusLabel}</span>
            {elapsed && <span className="shrink-0 text-caption text-text-secondary">{elapsed}</span>}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </section>
  );
}
