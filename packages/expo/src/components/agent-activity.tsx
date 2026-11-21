import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretDown, CaretRight, CheckCircle, WarningCircle, Wrench } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { DISABLED_OPACITY, TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/** One bouncing dot of {@link ThinkingIndicator}; the loop is never started when `animate` is false. */
function Dot({ tone, delay, animate }: { tone: ColorToken; delay: number; animate: boolean }) {
  const theme = useHoronTheme();
  const [phase] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!animate) {
      phase.setValue(0);
      return undefined;
    }
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, {
          toValue: 1,
          duration: 480,
          easing: easing.out,
          useNativeDriver: true,
        }),
        Animated.timing(phase, { toValue: 0, duration: 720, easing: easing.in, useNativeDriver: true }),
      ]),
    );
    const start = setTimeout(() => bounce.start(), delay);
    return () => {
      clearTimeout(start);
      bounce.stop();
    };
  }, [animate, delay, phase]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.dot,
        { backgroundColor: theme.color(tone) },
        animate && {
          opacity: phase.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
          transform: [{ translateY: phase.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) }],
        },
      ]}
    />
  );
}

/**
 * Figma `Thinking` (Agent activity 108:660): a 69x31 subtle pill with three 7px dots at 35/55/80% ink.
 * Announced as `status` with the `label`; the three dots bounce with a 150ms stagger, and the loop is
 * not started at all when Reduce Motion is on, so the dots sit still instead of fading.
 *
 * @example
 * ```tsx
 * <ThinkingIndicator label="Searching the workspace…" />
 * ```
 */
// prettier-ignore
export function ThinkingIndicator({ label = "Thinking" }: {
  /** Accessible status text, not rendered visibly. @default "Thinking" */
  label?: string;
}) {
  const theme = useHoronTheme();
  return (
    <View
      role="status"
      accessibilityLabel={label}
      accessible
      style={[styles.thinking, { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") }]}
    >
      <Dot tone="overlay-ink-35" delay={0} animate={!theme.reducedMotion} />
      <Dot tone="overlay-ink-55" delay={150} animate={!theme.reducedMotion} />
      <Dot tone="overlay-ink-80" delay={300} animate={!theme.reducedMotion} />
    </View>
  );
}

/** Characters per second the reveal moves at least; a larger backlog drains faster (about a third of a second). */
const REVEAL_RATE = 90;
const BACKLOG_DRAIN = 3;

/** Moves `end` past a high surrogate so an emoji is never cut in half. */
function codePointEnd(text: string, end: number): number {
  const code = text.charCodeAt(end - 1);
  return code >= 0xd800 && code <= 0xdbff ? end + 1 : end;
}

/**
 * How much of `text` to show. While `smooth` streaming runs, new characters are revealed a few per frame so
 * bursty chunks read as steady typing; otherwise, and under reduced motion, everything shows at once.
 * Text that no longer extends what was shown (a rewrite) restarts from the shared prefix.
 */
function useRevealedLength(text: string, smooth: boolean, reducedMotion: boolean): number {
  const [shown, setShown] = useState(text.length);
  const shownRef = useRef(text.length);
  const previous = useRef(text);

  useEffect(() => {
    const set = (length: number) => {
      shownRef.current = length;
      setShown(length);
    };
    let start = Math.min(shownRef.current, text.length);
    const before = previous.current;
    previous.current = text;
    let shared = 0;
    while (shared < start && text[shared] === before[shared]) shared++;
    start = shared;

    if (!smooth || reducedMotion || typeof requestAnimationFrame !== "function") {
      set(text.length);
      return undefined;
    }
    if (start !== shownRef.current) set(start);
    if (start >= text.length) return undefined;

    let position = start;
    let last = Date.now();
    let frame = requestAnimationFrame(function tick() {
      const now = Date.now();
      const seconds = Math.min(0.1, (now - last) / 1000);
      last = now;
      const backlog = text.length - position;
      position = Math.min(text.length, position + Math.max(REVEAL_RATE * seconds, backlog * BACKLOG_DRAIN * seconds));
      const length = Math.min(text.length, codePointEnd(text, Math.floor(position)));
      if (length !== shownRef.current) set(length);
      if (length < text.length) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [text, smooth, reducedMotion]);

  return Math.min(shown, text.length);
}

/** The 2px ink caret after the answer; it blinks while the stream waits and holds still otherwise. */
function Caret({ blink, height }: { blink: boolean; height: number }) {
  const theme = useHoronTheme();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!blink) {
      opacity.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.delay(500),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink, opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.caret, { height, backgroundColor: theme.color("interactive-primary") }, blink && { opacity }]}
    />
  );
}

/** Props for {@link StreamingText}: the growing answer, whether it is still streaming, and whether chunks are revealed smoothly. */
export type StreamingTextProps = {
  /** Everything received so far; pass the growing string as chunks arrive. */
  text: string;
  /** True while more text is coming: the caret shows, and the rest is revealed when it turns false. @default true */
  streaming?: boolean;
  /** Reveal arriving chunks a few characters per frame instead of in jumps. Off under reduced motion. @default true */
  smooth?: boolean;
  /** Layout of the bubble, such as a maximum width. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma `Streaming` (108:660): the bot bubble an answer types into, body-sm text and a 2px ink caret that
 * sits after the last character. The caret holds still while characters land and blinks while waiting for
 * the next chunk; it goes away when the stream ends. Screen readers get the answer once, when it is
 * complete, instead of every chunk.
 *
 * `text` is the whole answer so far, not a delta: passing only the newest chunk would drop earlier text. The
 * reveal restarts from the shared prefix when `text` is rewritten rather than extended.
 *
 * React Native cannot place a view inline inside a wrapped `<Text>`, so the caret is a sibling laid out at
 * the bubble's end.
 *
 * @example
 * ```tsx
 * function Answer({ text, done }: { text: string; done: boolean }) {
 *   return <StreamingText text={text} streaming={!done} />;
 * }
 * ```
 */
export function StreamingText({ text, streaming = true, smooth = true, style }: StreamingTextProps) {
  const theme = useHoronTheme();
  const shown = useRevealedLength(text, streaming && smooth, theme.reducedMotion);
  const typing = shown < text.length;
  const caretHeight = Math.round(theme.text("body-sm").fontSize * 1.15);

  return (
    <View
      style={[
        styles.stream,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      <View style={styles.streamRow}>
        <HoronText
          variant="body-sm"
          style={styles.streamText}
          accessibilityElementsHidden={streaming}
          importantForAccessibility={streaming ? "no-hide-descendants" : "auto"}
        >
          {text.slice(0, shown)}
        </HoronText>
        {streaming ? <Caret blink={!typing && !theme.reducedMotion} height={caretHeight} /> : null}
      </View>
      {streaming ? null : (
        <HoronText variant="caption" accessibilityLiveRegion="polite" style={styles.srOnly} maxFontSizeMultiplier={1}>
          {text}
        </HoronText>
      )}
    </View>
  );
}

/** Progress of a tool call: `running` shows a spinner, `done` a check, `failed` a warning and danger text. */
export type ToolStepState = "running" | "done" | "failed";

/** Props for {@link ToolStep}: the tool line, an optional detail line and the progress state. */
export type ToolStepProps = {
  /** Progress state, which also picks the leading icon and the title colour. @default "running" */
  state?: ToolStepState;
  /** The tool call line, truncated to one line. */
  title: ReactNode;
  /** Optional second line, such as the target or a short result, truncated to one line. */
  detail?: ReactNode;
  /** Runs when the row is tapped. */
  onPress?: () => void;
  /** Blocks the row and dims it to 40%. */
  disabled?: boolean;
  /** Layout of the row, for margins. */
  style?: StyleProp<ViewStyle>;
};

/** A value that can sit in one line of text. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Tool step` (108:660): a flat 12px-radius row with spinner, check or warning, and a caret.
 * The whole row is a button, so pass `onPress` to open the call's detail; the caret does not expand
 * anything on its own.
 *
 * @example
 * ```tsx
 * <ToolStep state="done" title="Search the web" detail="3 results" onPress={openCall} />
 * ```
 */
export function ToolStep({ state = "running", title, detail, onPress, disabled, style }: ToolStepProps) {
  const theme = useHoronTheme();
  const danger = state === "failed";
  return (
    <HoronPressable
      role="button"
      pressScale
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.tool,
        {
          borderColor: theme.color("border-default"),
          backgroundColor: theme.color("bg-surface"),
          minHeight: theme.touch ? TOUCH_TARGET : undefined,
        },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      {({ pressed }) => (
        <View style={[styles.toolRow, pressed && !disabled && { backgroundColor: theme.color("overlay-ink-3") }]}>
          {state === "running" ? <Spinner size="sm" /> : null}
          {state === "done" ? <CheckCircle size={16} color={theme.color("text-secondary")} /> : null}
          {state === "failed" ? <WarningCircle size={16} color={theme.color("text-danger")} /> : null}
          <View style={styles.toolText}>
            {isPlainText(title) ? (
              <HoronText variant="label-md" tone={danger ? "text-danger" : "text-primary"} numberOfLines={1}>
                {title}
              </HoronText>
            ) : (
              <View style={styles.shrink}>{title}</View>
            )}
            {detail ? (
              isPlainText(detail) ? (
                <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                  {detail}
                </HoronText>
              ) : (
                <View style={styles.shrink}>{detail}</View>
              )
            ) : null}
          </View>
          <CaretRight size={14} color={theme.color("text-secondary")} />
        </View>
      )}
    </HoronPressable>
  );
}

/** One compact line inside a work log. */
export type WorkLogStep = {
  /** Stable key for the step. */
  id: string;
  /** Step text, truncated to one line. */
  title: ReactNode;
  /** Optional second line with a short result or target. */
  detail?: ReactNode;
  /** Shows a small spinner instead of the check while the step is still running. */
  running?: boolean;
};

/** The rotating caret of {@link WorkLog}; a single timing, never a loop. */
function SummaryCaret({ open }: { open: boolean }) {
  const theme = useHoronTheme();
  const [turn] = useState(() => new Animated.Value(open ? 1 : 0));

  useEffect(() => {
    Animated.timing(turn, {
      toValue: open ? 1 : 0,
      duration: theme.reducedMotion ? 0 : duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [open, theme.reducedMotion, turn]);

  return (
    <Animated.View
      style={{
        transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ["-90deg", "0deg"] }) }],
      }}
    >
      <CaretDown size={14} color={theme.color("text-secondary")} />
    </Animated.View>
  );
}

/**
 * Figma `Work log` (108:660): a flat subtle card with a wrench summary row and compact steps. React used a
 * native `<details open>`; React Native has no such element, so the group keeps the same open state
 * locally and the steps collapse by not rendering, with the caret rotating while closed.
 *
 * @example
 * ```tsx
 * <WorkLog
 *   summary="4 steps"
 *   steps={[
 *     { id: "read", title: "Read the sheet", detail: "18 rows", running: false },
 *     { id: "write", title: "Draft the summary", running: true },
 *   ]}
 * />
 * ```
 */
export function WorkLog({
  summary,
  steps,
}: {
  /** Summary line in the toggle row, such as "4 steps". */
  summary: ReactNode;
  /** Steps listed under the summary. */
  steps: WorkLogStep[];
}) {
  const theme = useHoronTheme();
  const [open, setOpen] = useState(true);
  const summaryText = isPlainText(summary) ? String(summary) : undefined;

  return (
    <View
      style={[
        styles.worklog,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
      ]}
    >
      <HoronPressable
        role="button"
        accessibilityLabel={summaryText}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [
          styles.summary,
          { minHeight: theme.touch ? TOUCH_TARGET : undefined },
          pressed && { backgroundColor: theme.color("overlay-ink-3") },
        ]}
      >
        <Wrench size={14} color={theme.color("text-secondary")} />
        <View style={styles.summaryText}>
          {isPlainText(summary) ? (
            <HoronText variant="caption" tone="text-secondary">
              {summary}
            </HoronText>
          ) : (
            summary
          )}
        </View>
        <SummaryCaret open={open} />
      </HoronPressable>
      {open
        ? steps.map((step) => (
            <View key={step.id} style={styles.step}>
              {step.running ? <Spinner size="xs" /> : <CheckCircle size={14} color={theme.color("text-secondary")} />}
              <View style={styles.toolText}>
                {isPlainText(step.title) ? (
                  <HoronText variant="label-sm" numberOfLines={1}>
                    {step.title}
                  </HoronText>
                ) : (
                  <View style={styles.shrink}>{step.title}</View>
                )}
                {step.detail ? (
                  isPlainText(step.detail) ? (
                    <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                      {step.detail}
                    </HoronText>
                  ) : (
                    <View style={styles.shrink}>{step.detail}</View>
                  )
                ) : null}
              </View>
            </View>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  thinking: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 31,
    width: 69,
    gap: spacing["2"],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  dot: { width: 7, height: 7, borderRadius: radius.full },
  stream: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3"],
  },
  streamRow: { flexDirection: "row", alignItems: "flex-end" },
  streamText: { flexShrink: 1 },
  caret: { width: 2, borderRadius: 1, marginLeft: spacing["0.5"] },
  srOnly: { height: 0, opacity: 0 },
  tool: {
    width: "100%",
    borderRadius: radius.md,
    borderWidth: 1,
  },
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["2.5"],
    paddingVertical: spacing["2"],
    borderRadius: radius.md,
  },
  toolText: { flex: 1, minWidth: 0, gap: 1 },
  shrink: { minWidth: 0 },
  worklog: {
    width: "100%",
    maxWidth: 340,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    padding: spacing["1.5"],
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    paddingHorizontal: spacing["2.5"],
    paddingVertical: spacing["1.5"],
    borderRadius: radius.md,
  },
  summaryText: { flex: 1, minWidth: 0 },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["2.5"],
    paddingVertical: spacing["1.5"],
  },
});
