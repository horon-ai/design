import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/**
 * Footer state of a `PlanCard`: at most one at a time, and setting it shows the
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
  /** Plan title, rendered as the heading under the label. */
  title: ReactNode;
  /** `PlanStep`s, stacked without dividers. */
  children?: ReactNode;
  /** Footer state. Unset hides the footer. */
  status?: PlanCardStatus;
  /** Footer text, such as "Stopped · step 4 failed" or "Running · 1 of 5". */
  statusLabel?: ReactNode;
  /** Right-aligned footer timestamp or duration, kept in caption colour. */
  elapsed?: ReactNode;
  /** Extra classes on the card, merged after the built-in ones. */
  className?: string;
};

const fadeIn = {
  animationName: "fade-in",
  animationDuration: "160ms",
  animationTimingFunction: "var(--ease-out-quint)",
  animationFillMode: "both",
} as const;

/**
 * Figma `Plan card` (Agents N3): a 20px-radius solid card with a label, title, the steps and a status footer.
 *
 * React wrapped the footer in a Base UI `Collapsible` that stayed mounted so passing and clearing
 * `status` animated the collapse. Lynx has no collapsible primitive and its stylesheet does not match
 * the `data-*` attributes the animation keyed on, so the footer is mounted while `status` is set and
 * the footer text alone fades in when the state changes. React's `section`/`header`/`h3` become
 * `view`s with the same accessibility role descriptions.
 *
 * @example
 * ```tsx
 * <PlanCard label="Plan · 3 steps" title="Ship the parser" status="running" statusLabel="Running · 1 of 3">
 *   <PlanStep status="done" index={1} title="Read the spec" />
 *   <PlanStep status="running" index={2} title="Write the parser" />
 * </PlanCard>
 * ```
 */
export function PlanCard({ label, title, children, status, statusLabel, elapsed, className }: PlanCardProps) {
  return (
    <view
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
      accessibility-element
      accessibility-role-description="region"
    >
      <view className="flex flex-col gap-2 px-6 pb-3.5 pt-5">
        {label ? (
          <view className="flex min-w-0 flex-row items-center gap-2">
            <Icon name="ListChecks" size={16} color="text-secondary" />
            <view className="min-w-0 flex-1">
              <text className="break-all text-body-sm text-text-secondary">{label}</text>
            </view>
          </view>
        ) : null}
        <view className="min-w-0">
          <text className="break-all text-label-lg font-semibold text-text-primary">{title}</text>
        </view>
      </view>
      <view className="flex flex-col px-6 pb-1 pt-1.5">{children}</view>
      {status !== undefined ? (
        <view className="flex flex-col">
          <view className="h-px bg-overlay-ink-8" accessibility-element={false} />
          <view
            className={cn(
              "motion-colors flex min-w-0 flex-row items-center gap-2 px-6 pb-4 pt-3.5",
              status === "failed" ? "text-text-danger" : "text-text-primary",
            )}
          >
            {status === "running" ? <Spinner size={14} /> : null}
            {status === "failed" ? <Icon name="WarningCircle" size={16} color="text-danger" /> : null}
            <view className="min-w-0 flex-1">
              <text
                key={status}
                className={cn(
                  "break-all",
                  status === "failed" ? "text-label-md text-text-danger" : "text-label-md text-text-primary",
                )}
                style={fadeIn}
              >
                {statusLabel}
              </text>
            </view>
            {elapsed ? (
              <view className="shrink-0">
                <text className="text-caption text-text-secondary" style={fadeIn}>
                  {elapsed}
                </text>
              </view>
            ) : null}
          </view>
        </view>
      ) : null}
    </view>
  );
}
