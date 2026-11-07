import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
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

/** The status card's rim per state, drawn on the host because Lynx's glass layer does not read `--glass-edge`. */
const pendingEdge = "border-border-brand";

/**
 * Figma `Approval card` (64:398): the conversation part that asks for an action.
 * Pending keeps the brand rim and the actions.
 *
 * Controlled by `state`: the card never flips itself, and once it leaves `pending` the actions are
 * removed rather than collapsed, so a settled request cannot be answered twice. React collapsed them
 * with `motion-reveal` on `data-collapsed`; Lynx's stylesheet does not match `data-*` attributes, so
 * the action row is mounted only while the state is `pending`.
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
    <view
      className={cn(
        "relative flex w-full max-w-[360px] min-w-0 flex-col items-start overflow-hidden rounded-xl p-4 motion-colors",
        surface === "glass"
          ? cn("bg-glass-thick", state === "pending" && pendingEdge)
          : cn("border border-border-default bg-bg-surface", state === "pending" && pendingEdge),
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className={cn("relative flex flex-row items-center gap-1.5 motion-colors", tone.text)}>
        <view className={cn("size-2 shrink-0 rounded-full motion-colors", tone.dot)} accessibility-element={false} />
        <text
          key={state}
          className={cn("text-label-sm", tone.text)}
          style={{
            animationName: "fade-in",
            animationDuration: "160ms",
            animationTimingFunction: "var(--ease-out-quint)",
            animationFillMode: "both",
          }}
        >
          {status ?? tone.label}
        </text>
      </view>
      <view className="relative mt-3">
        <text className="text-label-lg text-text-primary">{title}</text>
      </view>
      {attachment ? (
        <view className="relative mt-3 flex max-w-full min-w-0 flex-row items-center gap-2 rounded-md bg-overlay-ink-5 px-3 py-2">
          <Icon name="Paperclip" size={14} color="text-secondary" />
          <view className="min-w-0 flex-1">
            <text className="overflow-hidden text-ellipsis whitespace-nowrap text-body-sm text-text-primary">{attachment}</text>
          </view>
        </view>
      ) : null}
      {state === "pending" ? (
        <view className="flex w-full flex-row justify-end gap-2 pt-3">
          <Button size="sm" variant={surface === "glass" ? "glass" : "solid"} onClick={onLater}>
            {laterLabel}
          </Button>
          <Button size="sm" onClick={onApprove}>
            {approveLabel}
          </Button>
        </view>
      ) : null}
    </view>
  );
}
