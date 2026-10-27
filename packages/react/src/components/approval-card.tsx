import { Paperclip } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { LiquidGlass } from "./liquid-glass";

export type ApprovalState = "pending" | "approved" | "declined";

export type ApprovalCardProps = {
  state?: ApprovalState;
  /** Status line, defaults to "Needs your yes", "Approved" or "Declined". */
  status?: ReactNode;
  /** The question, such as "Send the Q3 board deck to the team?". */
  title: ReactNode;
  /** Name of the attached item. */
  attachment?: ReactNode;
  onApprove?: () => void;
  onLater?: () => void;
  approveLabel?: string;
  laterLabel?: string;
  className?: string;
};

const statusClass: Record<ApprovalState, { dot: string; text: string; label: string }> = {
  pending: { dot: "bg-status-live", text: "text-text-brand", label: "Needs your yes" },
  approved: { dot: "bg-text-secondary", text: "text-text-secondary", label: "Approved" },
  declined: { dot: "bg-text-danger", text: "text-text-danger", label: "Declined" },
};

/**
 * Figma `Approval card` (64:398): the one conversation part that is glass,
 * because it asks for an action. Pending keeps the brand rim and the actions.
 */
export function ApprovalCard({
  state = "pending",
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
        "relative flex w-90 flex-col items-start gap-3 overflow-clip rounded-xl border bg-glass-thick p-4 motion-colors",
        state === "pending" ? "border-border-brand" : "border-glass-rim-strong",
        className,
      )}
    >
      <LiquidGlass tier="thick" />
      <div className={cn("relative flex items-center gap-1.5 text-label-sm", tone.text)}>
        <span aria-hidden className={cn("size-2 rounded-full", tone.dot)} />
        {status ?? tone.label}
      </div>
      <p className="relative text-label-lg text-text-primary">{title}</p>
      {attachment && (
        <div className="relative flex items-center gap-2 rounded-md bg-overlay-ink-5 px-3 py-2 text-body-sm text-text-primary">
          <Paperclip aria-hidden className="size-3.5 text-text-secondary" />
          {attachment}
        </div>
      )}
      {state === "pending" && (
        <div className="relative flex gap-2">
          <Button size="sm" onClick={onApprove}>
            {approveLabel}
          </Button>
          <Button size="sm" variant="glass" onClick={onLater}>
            {laterLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
