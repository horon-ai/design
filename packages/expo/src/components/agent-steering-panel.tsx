import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import { ArrowUp, Check, Lightning, PathIcon, Pause, Play, X } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { useDevice } from "../hooks/use-device";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Kbd } from "./kbd";
import { Spinner } from "./spinner";

/** Progress of one step: `done` fills the marker green, `active` shows a spinner, `todo` a dashed ring. */
export type SteeringStepStatus = "done" | "active" | "todo";

/** One step in the steering rail: its label, progress status and optional duration. */
export type SteeringStep = {
  /** Stable key for the step. */
  id: string;
  /** Step text; secondary colour while the step is still `todo`. */
  label: ReactNode;
  /** Progress marker to draw. */
  status: SteeringStepStatus;
  /** Duration of a finished or running step, such as "1.4s". */
  time?: ReactNode;
};

/** One steer note: the text and whether it has already been applied. */
export type SteeringNote = {
  /** Stable key for the note. */
  id: string;
  /** The steer text, shown on one row and wrapping as needed. */
  text: ReactNode;
  /** An applied note has left the queue and carries the "Now" pill. @default false */
  applied?: boolean;
};

/** Props for {@link AgentSteeringPanel}: the task header, the steps, queued notes and the steer handlers. */
export type AgentSteeringPanelProps = {
  /** Task name in the header, truncated to one line. */
  title: ReactNode;
  /** Second header line, such as the bot or workspace, truncated to one line. */
  subtitle?: ReactNode;
  /** The status text beside the live dot, such as "Running · 2m 10s". */
  status?: ReactNode;
  /** Pauses the live dot pulse and swaps the button to Play; the panel does not stop work on its own. @default false */
  paused?: boolean;
  /** Fires when the pause/resume button is pressed, with the next paused value. */
  onPausedChange?: (paused: boolean) => void;
  /** Ordered steps of the running task; the connector under a done step turns live green. */
  steps: SteeringStep[];
  /** Notes queued for the next step, plus any already applied. @default [] */
  notes?: SteeringNote[];
  /** Fires with the note id when its "Now" button is pressed, to apply it immediately. */
  onApplyNow?: (id: string) => void;
  /** Fires with the note id after its pop-out animation ends; remove it from `notes` here. */
  onRemoveNote?: (id: string) => void;
  /** Called with the text typed in the steer box: the send key queues it for the next step. */
  onSteer?: (text: string, interrupt: boolean) => void;
  /** Placeholder of the steer input; also its accessible name. @default "Steer the bot…" */
  placeholder?: string;
  /** Layout of the panel, for margins or a width override. */
  style?: StyleProp<ViewStyle>;
};

const noNotes: SteeringNote[] = [];

/** Human word of each step state, exposed through the step row's accessibility value. */
const statusWord: Record<SteeringStepStatus, string> = { done: "Done", active: "Running", todo: "Waiting" };

/** Whether a value can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The entrance of react's `motion-rise`: opacity and a 4px rise, once, skipped under Reduce Motion. */
function Rise({ delay = 0, style, children }: { delay?: number; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const theme = useHoronTheme();
  const [progress] = useState(() => new Animated.Value(theme.reducedMotion ? 1 : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.popIn,
      delay,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, progress, theme.reducedMotion]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Marker for one step: green check when done, spinner when active, dashed ring while waiting. */
function Marker({ status }: { status: SteeringStepStatus }) {
  const theme = useHoronTheme();
  if (status === "done") {
    return (
      <View
        accessible
        accessibilityLabel={statusWord.done}
        style={[styles.markerDone, { backgroundColor: theme.color("status-live") }]}
      >
        <Check size={12} weight="bold" color={theme.color("text-on-ink")} />
      </View>
    );
  }
  if (status === "active") return <Spinner size={18} label={statusWord.active} />;
  return (
    <View
      accessible
      accessibilityLabel={statusWord.todo}
      style={[styles.markerTodo, { borderColor: theme.color("border-dashed") }]}
    />
  );
}

/** One queued note: the text, a "Now" action and a remove button, or a filled "Now" pill once applied. */
function SteeringNoteRow({
  note,
  onApplyNow,
  onRemoveNote,
}: {
  /** The note to render; `applied` swaps the actions for the filled pill. */
  note: SteeringNote;
  /** Called with the note id when "Now" is pressed. */
  onApplyNow?: (id: string) => void;
  /** Called with the note id when the row has finished leaving. */
  onRemoveNote?: (id: string) => void;
}) {
  const theme = useHoronTheme();
  const [leaving, setLeaving] = useState(false);
  const [exit] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!leaving) return undefined;
    if (theme.reducedMotion) {
      onRemoveNote?.(note.id);
      return undefined;
    }
    const animation = Animated.timing(exit, {
      toValue: 0,
      duration: duration.popOut,
      easing: easing.in,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) onRemoveNote?.(note.id);
    });
    return () => animation.stop();
  }, [exit, leaving, note.id, onRemoveNote, theme.reducedMotion]);

  return (
    <Animated.View
      style={
        leaving && {
          opacity: exit,
          transform: [{ scale: exit.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) }],
        }
      }
    >
      <Rise style={[styles.note, { backgroundColor: theme.color("overlay-ink-4") }]}>
        {isPlainText(note.text) ? (
          <HoronText variant="body-sm" style={styles.noteText}>
            {note.text}
          </HoronText>
        ) : (
          <View style={[styles.noteText, styles.shrink]}>{note.text}</View>
        )}
        {note.applied ? (
          <View style={[styles.appliedPill, { backgroundColor: theme.color("interactive-primary") }]}>
            <Lightning size={12} weight="fill" color={theme.color("text-inverse")} />
            <HoronText variant="label-sm" tone="text-inverse">
              Now
            </HoronText>
          </View>
        ) : (
          <View style={styles.noteActions}>
            <HoronPressable
              role="button"
              pressScale
              onPress={() => onApplyNow?.(note.id)}
              style={({ pressed }) => [
                styles.nowPill,
                {
                  backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
                  minHeight: theme.touch ? TOUCH_TARGET : 26,
                },
              ]}
            >
              <Lightning size={12} color={theme.color("text-primary")} />
              <HoronText variant="label-sm">Now</HoronText>
            </HoronPressable>
            <HoronPressable
              role="button"
              pressScale
              accessibilityLabel="Remove note"
              onPress={() => setLeaving(true)}
              style={({ pressed }) => [
                styles.removeButton,
                {
                  width: theme.touch ? TOUCH_TARGET : 24,
                  height: theme.touch ? TOUCH_TARGET : 24,
                  backgroundColor: pressed ? theme.color("overlay-ink-6") : "transparent",
                },
              ]}
            >
              <X size={14} color={theme.color("text-secondary")} />
            </HoronPressable>
          </View>
        )}
      </Rise>
    </Animated.View>
  );
}

/** The 6px live dot; its pulse loop is never started under Reduce Motion or while paused. */
function LiveDot({ paused }: { paused: boolean }) {
  const theme = useHoronTheme();
  const [pulse] = useState(() => new Animated.Value(0));
  const still = paused || theme.reducedMotion;

  useEffect(() => {
    if (still) return undefined;
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: duration.livePulse,
        easing: easing.outQuint,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      pulse.setValue(0);
    };
  }, [pulse, still]);

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.liveDotFrame}>
      {still ? null : (
        <Animated.View
          style={[
            styles.liveDotRing,
            {
              borderColor: theme.color("status-live"),
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
            },
          ]}
        />
      )}
      <View style={[styles.liveDot, { backgroundColor: theme.color("status-live") }]} />
    </View>
  );
}

/**
 * Paper `Agent steering` (Y51-1): a 24px-radius surface panel with the running task header, a step rail, the notes
 * queued for the next step, and a steer box. The live dot pulses every 2s, a step marker swaps with a short pop,
 * new steps and notes rise in 220ms, and a removed note pops out in 130ms before `onRemoveNote` fires.
 *
 * The steer draft is local state: it clears after `onSteer` fires, and the panel never queues a note itself.
 * React sent on Mod+Enter to interrupt and on Enter to queue; a phone keyboard has no modifier, so the send key
 * queues and the two hint chips stay hidden on touch devices that show no keyboard hints.
 *
 * @example
 * ```tsx
 * <AgentSteeringPanel
 *   title="Quarterly revenue review"
 *   status="Running · 2m 10s"
 *   steps={[
 *     { id: "read", label: "Read the sheet", status: "done", time: "1.4s" },
 *     { id: "summarise", label: "Summarise the rows", status: "active" },
 *   ]}
 *   onSteer={(text, interrupt) => steer(text, interrupt)}
 * />
 * ```
 */
export function AgentSteeringPanel({
  title,
  subtitle,
  status,
  paused = false,
  onPausedChange,
  steps,
  notes = noNotes,
  onApplyNow,
  onRemoveNote,
  onSteer,
  placeholder = "Steer the bot…",
  style,
}: AgentSteeringPanelProps) {
  const theme = useHoronTheme();
  const { keyboardHints } = useDevice();
  const [draft, setDraft] = useState("");
  const queued = notes.filter((note) => !note.applied);

  const submit = (interrupt: boolean) => {
    const text = draft.trim();
    if (!text) return;
    onSteer?.(text, interrupt);
    setDraft("");
  };

  return (
    <View
      style={[
        styles.panel,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      <View style={styles.header}>
        <PathIcon size={18} color={theme.color("text-primary")} />
        <View style={styles.heading}>
          {isPlainText(title) ? (
            <HoronText variant="label-lg" numberOfLines={1}>
              {title}
            </HoronText>
          ) : (
            <View style={styles.shrink}>{title}</View>
          )}
          {subtitle ? (
            isPlainText(subtitle) ? (
              <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                {subtitle}
              </HoronText>
            ) : (
              <View style={styles.shrink}>{subtitle}</View>
            )
          ) : null}
        </View>
        <LiveDot paused={paused} />
        {status ? (
          isPlainText(status) ? (
            <HoronText variant="body-sm" tone="text-secondary" numberOfLines={1} style={styles.statusText}>
              {status}
            </HoronText>
          ) : (
            <View style={styles.shrink}>{status}</View>
          )
        ) : null}
        <HoronPressable
          role="button"
          pressScale
          accessibilityLabel={paused ? "Resume" : "Pause"}
          accessibilityState={{ selected: paused }}
          onPress={() => onPausedChange?.(!paused)}
          style={({ pressed }) => [
            styles.pauseButton,
            {
              backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
              width: theme.touch ? TOUCH_TARGET : 30,
              height: theme.touch ? TOUCH_TARGET : 30,
            },
          ]}
        >
          {paused ? (
            <Play size={16} weight="fill" color={theme.color("text-primary")} />
          ) : (
            <Pause size={16} weight="fill" color={theme.color("text-primary")} />
          )}
        </HoronPressable>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />

      <View style={styles.steps}>
        {steps.map((step, index) => (
          <Rise key={step.id} delay={index * 30} style={styles.step}>
            <View
              accessible
              accessibilityLabel={isPlainText(step.label) ? String(step.label) : undefined}
              accessibilityValue={{ text: statusWord[step.status] }}
              style={styles.stepRow}
            >
              <View style={styles.markerSlot}>
                <Marker status={step.status} />
              </View>
              {index < steps.length - 1 ? (
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={[
                    styles.connector,
                    {
                      backgroundColor: theme.color(step.status === "done" ? "status-live" : "overlay-ink-10"),
                    },
                  ]}
                />
              ) : null}
              {isPlainText(step.label) ? (
                <HoronText
                  variant="body-sm"
                  tone={step.status === "todo" ? "text-secondary" : "text-primary"}
                  style={styles.stepText}
                >
                  {step.label}
                </HoronText>
              ) : (
                <View style={[styles.stepText, styles.shrink]}>{step.label}</View>
              )}
              {step.time ? (
                isPlainText(step.time) ? (
                  <HoronText variant="caption" tone="text-secondary" style={styles.time}>
                    {step.time}
                  </HoronText>
                ) : (
                  step.time
                )
              ) : null}
            </View>
          </Rise>
        ))}
      </View>
      <View style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />

      <View style={styles.footer}>
        {notes.length > 0 ? (
          <View style={styles.queue}>
            <View style={styles.queueHeading}>
              <HoronText variant="caption" tone="text-secondary">
                Queued for the next step
              </HoronText>
              <Kbd>{queued.length}</Kbd>
            </View>
            <View style={styles.noteList}>
              {notes.map((note) => (
                <SteeringNoteRow key={note.id} note={note} onApplyNow={onApplyNow} onRemoveNote={onRemoveNote} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={[styles.steerBox, { backgroundColor: theme.color("overlay-ink-5") }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => submit(false)}
            submitBehavior="submit"
            returnKeyType="send"
            placeholder={placeholder}
            placeholderTextColor={theme.color("text-secondary")}
            accessibilityLabel={placeholder}
            maxFontSizeMultiplier={2}
            style={[styles.steerInput, theme.text("body-sm"), { color: theme.color("text-primary") }]}
          />
          <HoronPressable
            role="button"
            pressScale
            accessibilityLabel="Send"
            onPress={() => submit(false)}
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary"),
                width: theme.touch ? TOUCH_TARGET : 32,
                height: theme.touch ? TOUCH_TARGET : 32,
              },
            ]}
          >
            <ArrowUp size={16} color={theme.color("text-inverse")} />
          </HoronPressable>
        </View>

        {keyboardHints ? (
          <View style={styles.hints}>
            <View style={styles.hint}>
              <Kbd keys="Enter" />
              <HoronText variant="caption" tone="text-secondary">
                next step
              </HoronText>
            </View>
            <View style={styles.hint}>
              <Kbd keys="Mod+Enter" />
              <HoronText variant="caption" tone="text-secondary">
                interrupt now
              </HoronText>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 520,
    minWidth: 0,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["2.5"],
    rowGap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["3.5"],
  },
  heading: { flex: 1, minWidth: 0, flexDirection: "column" },
  statusText: { minWidth: 0, flexShrink: 1, fontVariant: ["tabular-nums"] },
  pauseButton: { flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  liveDotFrame: { width: 6, height: 6, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  liveDot: { width: 6, height: 6, borderRadius: radius.full },
  liveDotRing: { position: "absolute", width: 6, height: 6, borderRadius: radius.full, borderWidth: 1 },
  divider: { height: 1 },
  steps: { flexDirection: "column", gap: spacing["3"], paddingHorizontal: spacing["5"], paddingVertical: spacing["3"] },
  step: { minHeight: 26 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: spacing["3"], minHeight: 26 },
  markerSlot: { width: 20, height: 26, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  markerDone: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  markerTodo: { width: 18, height: 18, borderRadius: radius.full, borderWidth: 1, borderStyle: "dashed" },
  connector: { position: "absolute", left: 10, top: "50%", marginTop: 12.5, bottom: -18, width: 1 },
  stepText: { minWidth: 0, flex: 1 },
  time: { flexShrink: 0, fontVariant: ["tabular-nums"] },
  footer: {
    flexDirection: "column",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["5"],
    paddingVertical: spacing["3.5"],
  },
  queue: { flexDirection: "column", gap: spacing["2.5"] },
  queueHeading: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  noteList: { flexDirection: "column", gap: spacing["2"] },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    borderRadius: radius.md,
    paddingVertical: spacing["2"],
    paddingLeft: spacing["3.5"],
    paddingRight: spacing["2.5"],
  },
  noteText: { flex: 1, minWidth: 0 },
  noteActions: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"], flexShrink: 0 },
  nowPill: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
  appliedPill: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
    height: 26,
  },
  removeButton: { flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  steerBox: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderRadius: radius.full,
    paddingLeft: spacing["4"],
    paddingRight: spacing["1.5"],
  },
  steerInput: { flex: 1, minWidth: 0, height: 44, padding: 0 },
  sendButton: { flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  hints: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["3.5"],
    rowGap: spacing["1.5"],
  },
  hint: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  shrink: { minWidth: 0, flexShrink: 1 },
});
