import { Collapsible } from "@base-ui/react/collapsible";
import { ListChecks, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/**
 * Footer state of a `PlanCard`: at most one at a time, and setting it expands the
 * footer.
 *
 * - `running` shows a 14px spinner and keeps the footer text in the primary colour.
 * - `failed` shows a warning icon and tints the footer text with `text-text-danger`.
 */
export type PlanCardStatus = "running" | "failed";

/** Props for {@link PlanCard}: a label, title and step list, plus the optional status footer. */
export type PlanCardProps = {
  /** Label line next to the 16px list icon, such as "Plan · 5 steps". */
  label?: ReactNode;
  /** Plan title, rendered as the `h3` under the label. */
  title: ReactNode;
  /** `PlanStep`s, stacked without dividers. */
  children?: ReactNode;
  /** Footer state. Unset hides the footer; a change expands or collapses it. */
  status?: PlanCardStatus;
  /** Footer text, such as "Stopped · step 4 failed" or "Running · 1 of 5". */
  statusLabel?: ReactNode;
  /** Right-aligned footer timestamp or duration, kept in caption colour. */
  elapsed?: ReactNode;
  /** Extra classes on the `section` element, merged after the built-in ones. */
  className?: string;
};

/**
 * Figma `Plan card` (Agents N3): a 20px-radius solid card with a label, title, the steps and a status footer.
 *
 * The footer is a `Collapsible` panel that stays mounted, so passing and clearing
 * `status` plays the collapse animation instead of mounting and unmounting. Only
 * the footer text fades in again, and only when `status` changes; the label line
 * above the title does not animate.
 *
 * @example
 * ```tsx
 * <PlanCard label="Plan · 3 steps" title="Ship the parser" status="running" statusLabel="Running · 1 of 3">
 *   <PlanStep status="done" index={1} title="Read the spec" />
 *   <PlanStep status="running" index={2} title="Write the parser" />
 *   <PlanStep status="pending" index={3} title="Publish" last />
 * </PlanCard>
 * ```
 */
export function PlanCard({ label, title, children, status, statusLabel, elapsed, className }: PlanCardProps) {
  return (
    <section
      className={cn(
        "flex w-full min-w-0 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
    >
      <header className="flex flex-col gap-2 px-6 pt-5 pb-3.5">
        {label && (
          <div className="flex min-w-0 items-center gap-2 text-body-sm text-text-secondary">
            <ListChecks aria-hidden className="size-4 shrink-0" />
            <span className="min-w-0 wrap-break-word">{label}</span>
          </div>
        )}
        <h3 className="min-w-0 text-label-lg font-semibold wrap-break-word text-text-primary">{title}</h3>
      </header>
      <div className="flex flex-col px-6 pt-1.5 pb-1">{children}</div>
      <Collapsible.Root open={status !== undefined}>
        <Collapsible.Panel keepMounted className="motion-collapse">
          <div className="h-px bg-overlay-ink-8" />
          <div
            className={cn(
              "flex min-w-0 items-center gap-2 px-6 pt-3.5 pb-4 text-label-md motion-colors",
              status === "failed" ? "text-text-danger" : "text-text-primary",
            )}
          >
            {status === "running" && <Spinner size={14} />}
            {status === "failed" && <WarningCircle aria-hidden className="size-4 shrink-0" />}
            <span key={String(status)} className="min-w-0 flex-1 animate-fade-in wrap-break-word">
              {statusLabel}
            </span>
            {elapsed && (
              <span
                key={elapsed ? "with-elapsed" : "without-elapsed"}
                className="shrink-0 animate-fade-in text-caption text-text-secondary"
              >
                {elapsed}
              </span>
            )}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </section>
  );
}
