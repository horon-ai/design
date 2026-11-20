import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Paperclip } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { HoronText } from "../lib/text";
import { Button } from "./button";

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

};

const TONE: Record<ApprovalState, { dot: ColorToken; text: ColorToken; label: string }> = {
  pending: { dot: "status-live", text: "text-brand", label: "Needs your yes" },
  approved: { dot: "text-secondary", text: "text-secondary", label: "Approved" },
  declined: { dot: "accent-red-500-90", text: "text-danger", label: "Declined" },
};

/**
 * Figma `Approval card` (64:398): the conversation part that asks for an action.
 *
 * Controlled by `state`: the card never flips itself, and once it leaves
 * `pending` the action row is removed rather than frozen, so a settled request
 * cannot be answered twice. `pending` keeps the brand rim — on the solid card as
 * the border, on the glass card as a 1pt brand ring over the material — and both
 * buttons fire their handler without changing the card.
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
}: ApprovalCardProps) {
  const theme = useHoronTheme();
  const tone = TONE[state];
  const pending = state === "pending";

  const body = (
    <>
      <View style={[styles.status, { gap: spacing["1.5"] }]}>
        <View style={[styles.dot, { backgroundColor: theme.color(tone.dot) }]} />
        <HoronText variant="label-sm" tone={tone.text}>
          {status ?? tone.label}
        </HoronText>
      </View>
      <HoronText variant="label-lg" style={styles.title}>
        {title}
      </HoronText>
      {attachment && (
        <View style={[styles.attachment, { backgroundColor: theme.color("overlay-ink-5") }]}>
          <Paperclip size={14} color={theme.color("text-secondary")} />
          <HoronText variant="body-sm" numberOfLines={1} style={styles.attachmentText}>
            {attachment}
          </HoronText>
        </View>
      )}
      {pending && (
        <View style={styles.actions}>
          <Button size="sm" variant={surface === "glass" ? "glass" : "solid"} onPress={onLater}>
            {laterLabel}
          </Button>
          <Button size="sm" onPress={onApprove}>
            {approveLabel}
          </Button>
        </View>
      )}
    </>
  );

  if (surface === "glass") {
    return (
      <View style={[styles.host, { borderRadius: radius.xl }]}>
        <GlassSurface tier="thick" radius={radius.xl} style={styles.card}>
          {body}
        </GlassSurface>
        {pending && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.edge,
              { borderColor: theme.color("border-brand"), borderRadius: radius.xl },
            ]}
          />
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        styles.border,
        {
          borderColor: theme.color(pending ? "border-brand" : "border-default"),
          backgroundColor: theme.color("bg-surface"),
        },
      ]}
    >
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { width: "100%", maxWidth: 360, alignSelf: "flex-start", borderCurve: "continuous" },
  card: {
    width: "100%",
    maxWidth: 360,
    minWidth: 0,
    alignItems: "flex-start",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    padding: spacing["4"],
  },
  border: { borderWidth: 1 },
  edge: { borderWidth: 1 },
  status: { flexDirection: "row", alignItems: "center" },
  dot: { width: spacing["2"], height: spacing["2"], borderRadius: radius.full },
  title: { marginTop: spacing["3"] },
  attachment: {
    marginTop: spacing["3"],
    maxWidth: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3"],
    paddingVertical: spacing["2"],
  },
  attachmentText: { minWidth: 0, flexShrink: 1 },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing["2"],
    paddingTop: spacing["3"],
  },
});
