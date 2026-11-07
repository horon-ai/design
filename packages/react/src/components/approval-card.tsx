import { Paperclip } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { LiquidGlass } from "./liquid-glass";

/** Lifecycle of the request: `pending` keeps the brand rim and both actions, the other states hide the actions. */
export type ApprovalState = "pending" | "approved" | "declined";
/** `solid` paints the raised surface, `glass` layers the glass material for use over imagery. */
export type ApprovalCardSurface = "solid" | "glass";

/** Props for {@link ApprovalCard}: the state, the question, the optional attachment and the action handlers. */
export type ApprovalCardProps = {
  /** Lifecycle state; drives the status dot, status text and whether the actions stay visible. @default "pending" */
  state?: ApprovalState;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: ApprovalCardSurface;
  /** Status line, defaults to "Needs your yes", "Approved" or "Declined". */
  status?: ReactNode;
  /** The question, such as "Send the Q3 board deck to the team?". */
  title: ReactNode;
  /** Name of the attached item. */
  attachment?: ReactNode;
  /** Fires when the primary action is pressed; the card does not change its own state. */
  onApprove?: () => void;
  /** Fires when the secondary action is pressed, for deferring without deciding. */
  onLater?: () => void;
  /** Label of the primary button. @default "Approve" */
  approveLabel?: string;
  /** Label of the secondary button. @default "Later" */
  laterLabel?: string;
  /** Extra classes merged onto the card, for margins or a width override. */
  className?: string;
};

const statusClass: Record<
  ApprovalState,
  {
    /** Background of the status dot. */
    dot: string;
    /** Text colour of the status line. */
    text: string;
    /** Default status line when `status` is omitted. */
    label: string;
  }
> = {
  pending: { dot: "bg-status-live", text: "text-text-brand", label: "Needs your yes" },
  approved: { dot: "bg-text-secondary", text: "text-text-secondary", label: "Approved" },
  declined: { dot: "bg-accent-red-500-90", text: "text-text-danger", label: "Declined" },
};

/**
 * Figma `Approval card` (64:398): the conversation part that asks for an action.
 * Pending keeps the brand rim and the actions.
 *
 * Controlled by `state`: the card never flips itself, and once it leaves `pending` the actions collapse and
 * become inert, so a settled request cannot be answered twice.
 *
 * @example
 * ```tsx
 * <ApprovalCard
 *   title="Send the Q3 board deck to the team?"
 *   attachment="Q3-board-deck.pdf"
 *   onApprove={send}
 *   onLater={dismiss}
 * />
 * ```
 */
export function ApprovalCard({
  state = "pending",
  surface = "solid",
  status,
  title,
  attachment,
  onApprove,
  onLater,
  approveLabel = "Approve",
  laterLabel = "Later",
  className,
}: ApprovalCardProps) {
  const tone = statusClass[state];
  return (
    <div
      className={cn(
        "relative flex w-full max-w-90 min-w-0 flex-col items-start overflow-clip rounded-xl p-4 motion-colors md:w-90",
        surface === "glass"
          ? cn("bg-glass-thick", state === "pending" && "[--glass-edge:var(--color-border-brand)]")
          : cn("border border-border-default bg-bg-surface", state === "pending" && "border-border-brand"),
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <div className={cn("relative flex items-center gap-1.5 text-label-sm motion-colors", tone.text)}>
        <span aria-hidden className={cn("size-2 rounded-full motion-colors", tone.dot)} />
        <span key={state} className="animate-fade-in">
          {status ?? tone.label}
        </span>
      </div>
      <p className="relative mt-3 text-label-lg text-text-primary">{title}</p>
      {attachment && (
        <div className="relative mt-3 flex max-w-full min-w-0 items-center gap-2 rounded-md bg-overlay-ink-5 px-3 py-2 text-body-sm text-text-primary">
          <Paperclip aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
          <span className="min-w-0 truncate">{attachment}</span>
        </div>
      )}
      <div className="motion-reveal w-full" data-collapsed={state !== "pending" || undefined}>
        <div>
          <div className="flex w-full justify-end gap-2 pt-3" inert={state !== "pending"}>
            <Button size="sm" variant={surface === "glass" ? "glass" : "solid"} onClick={onLater}>
              {laterLabel}
            </Button>
            <Button size="sm" onClick={onApprove}>
              {approveLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
