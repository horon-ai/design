import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, TextInput, View, type ViewProps } from "react-native";
import { ArrowUp, CaretDown, Check, MagnifyingGlass, Plus, Stop } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { duration, easing } from "../lib/motion";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "../lib/field-text";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { ChatBubble } from "./chat-bubble";
import { Spinner } from "./spinner";

/**
 * One query row in the list under the status line.
 */
export type ResearchQuery = {
  /** Stable key for the row. */
  id: string;
  /**
   * `searching` shows a spinner and the muted text; `done` a check. Anything else (omitted, and
   * any other value) renders as `done`.
   * @default "done"
   */
  state?: "done" | "searching";
  /** The query text, truncated with an ellipsis when the row runs out of width. */
  text: ReactNode;
  /** Result count shown at the end of the row, such as "8 results". */
  results?: ReactNode;
};

/**
 * Props for {@link ResearchRunPanel}. Extra `View` props (`style`, accessibility) land on the
 * outer panel.
 */
export type ResearchRunPanelProps = Omit<ViewProps, "title"> & {
  /**
   * Header title next to the magnifying glass.
   * @default "Research"
   */
  title?: ReactNode;
  /**
   * Text of the header button that starts a new run.
   * @default "New research"
   */
  newLabel?: ReactNode;
  /** Fires when the header button is pressed; the button is still rendered without it. */
  onNewResearch?: () => void;
  /** The question bubble, right-aligned. */
  question: ReactNode;
  /**
   * Shows the spinner, status line and caret while the run works; when false the status block
   * is removed and the round button becomes a send arrow.
   * @default true
   */
  running?: boolean;
  /**
   * Label in front of the caret in the status line.
   * @default "Researching"
   */
  statusLabel?: ReactNode;
  /** First meta value after the status label, such as "12s"; joins `read`/`total` with a middot. */
  elapsed?: ReactNode;
  /** Pages read so far; with `total` it renders "N of M read" and drives the sources pill label. */
  read?: number;
  /** Pages in the run; must be set together with `read` for the count to appear. */
  total?: number;
  /** Queries resolved so far, drawn under a 1.5pt rail with a 30ms stagger per row. */
  queries?: ResearchQuery[];
  /** Initials for the stacked source avatars under the queries. */
  sources?: string[];
  /** Fires from the round button while `running`, which then shows a stop glyph instead of an arrow. */
  onStop?: () => void;
  /** Makes the sources pill actionable; without it the pill is a plain label. */
  onOpenSources?: () => void;
  /** Makes the running status line expandable; without it the row carries no caret. */
  onToggleStatus?: () => void;
  /**
   * Placeholder and accessible name of the follow-up input.
   * @default "Ask a follow-up"
   */
  followUpPlaceholder?: string;
  /** Fires with the raw input value on submit; the field is cleared afterwards. */
  onFollowUp?: (value: string) => void;

};

/** The 1.5pt rail the query rows hang from, as a token colour. */
const RAIL: ColorToken = "overlay-ink-14";

/** One query row; it rises in on mount, delayed by its own 30ms step. */
function QueryRow({ query, index }: { query: ResearchQuery; index: number }) {
  const theme = useHoronTheme();
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return undefined;
    }
    const step = Animated.timing(rise, {
      toValue: 1,
      duration: duration.fadeIn,
      delay: index * 30,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    step.start();
    return () => step.stop();
  }, [index, rise, theme.reducedMotion]);

  const searching = query.state === "searching";
  return (
    <Animated.View
      style={[
        styles.query,
        {
          opacity: rise,
          transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }],
        },
      ]}
    >
      {searching ? (
        <Spinner size={14} />
      ) : (
        <Check size={14} color={theme.color("text-secondary")} />
      )}
      <HoronText
        variant="body-sm"
        tone={searching ? "text-secondary" : "text-primary"}
        numberOfLines={1}
        style={styles.queryText}
      >
        {query.text}
      </HoronText>
      {query.results !== undefined && (
        <HoronText variant="caption" tone="text-secondary">
          {query.results}
        </HoronText>
      )}
    </Animated.View>
  );
}

/** The 12pt caret after the status label: a 2pt brand bar blinking on a one-second step. */
function BlinkingCaret() {
  const theme = useHoronTheme();
  const [blink] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (theme.reducedMotion) {
      blink.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 1,
          duration: 500,
          easing: easing.inOut,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 0,
          duration: 500,
          easing: easing.inOut,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink, theme.reducedMotion]);

  return (
    <Animated.View
      style={[styles.caretBar, { opacity: blink, backgroundColor: theme.color("interactive-primary") }]}
    />
  );
}

/**
 * Paper `Research run` (Agents N10): a 20pt-radius panel with a header, the question, a live status line and the queries read so far.
 *
 * The panel is presentational: it holds no run state of its own. Submitted
 * follow-ups are handed to `onFollowUp` and the field is cleared, so the caller
 * appends the new question. While `running` the status row is announced politely
 * and the round button stops the run instead of submitting; the follow-up field
 * keeps its typed text during a run and only submits once it ends. Query rows rise
 * in on a 30ms stagger, and the source avatars overlap by 6pt inside their
 * surface ring.
 *
 * @example
 * ```tsx
 * <ResearchRunPanel
 *   question="What changed in the EU AI Act this year?"
 *   statusLabel="Reading sources"
 *   read={4}
 *   total={12}
 *   queries={[
 *     { id: "1", text: "EU AI Act amendments", results: "8 results" },
 *     { id: "2", text: "Enforcement timeline", state: "searching" },
 *   ]}
 *   sources={["EU", "CE"]}
 *   onStop={() => {}}
 *   onFollowUp={(value) => console.log(value)}
 * />
 * ```
 */
export function ResearchRunPanel({
  title = "Research",
  newLabel = "New research",
  onNewResearch,
  question,
  running = true,
  statusLabel = "Researching",
  elapsed,
  read,
  total,
  queries,
  sources,
  onStop,
  onOpenSources,
  onToggleStatus,
  followUpPlaceholder = "Ask a follow-up",
  onFollowUp,
  ...props
}: ResearchRunPanelProps) {
  const theme = useHoronTheme();
  const fieldText = useFieldText("body-sm");
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const count = read !== undefined && total !== undefined ? `${read} of ${total} read` : undefined;
  const meta = [
    { id: "elapsed", value: elapsed },
    { id: "count", value: count },
  ].filter((entry) => entry.value !== undefined);
  const sourcesLabel =
    read !== undefined && total !== undefined ? `${read} of ${total} sources read` : `${sources?.length ?? 0} sources`;

  const submit = () => {
    if (running) return;
    onFollowUp?.(draft);
    setDraft("");
  };

  const status = (
    <>
      <Spinner size={14} />
      <HoronText variant="label-md">{statusLabel}</HoronText>
      <BlinkingCaret />
      {meta.length > 0 && (
        <HoronText variant="caption" tone="text-secondary" style={styles.meta}>
          {meta.map((entry, index) => (
            <HoronText key={entry.id} variant="caption" tone="text-secondary">
              {index > 0 ? " · " : ""}
              {entry.value}
            </HoronText>
          ))}
        </HoronText>
      )}
    </>
  );

  const avatarList = (sources ?? []).map((initial, position) => ({
    initial,
    id: `source-${initial}-${position}`,
    first: position === 0,
  }));
  const avatars = (
    <View style={styles.avatars}>
      {avatarList.map((avatar) => (
        <View
          key={avatar.id}
          style={[
            styles.avatar,
            {
              marginLeft: avatar.first ? 0 : -6,
              backgroundColor: primitives["sky-700"],
              borderColor: theme.color("bg-surface"),
            },
          ]}
        >
          <HoronText variant="label-sm" tone="text-on-ink">
            {avatar.initial}
          </HoronText>
        </View>
      ))}
    </View>
  );

  return (
    <View
      {...props}
      style={[
        styles.panel,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
      ]}
    >
      <View style={styles.header}>
        <MagnifyingGlass size={16} color={theme.color("text-primary")} />
        <HoronText variant="label-lg" numberOfLines={1} style={styles.title}>
          {title}
        </HoronText>
        <HoronPressable
          pressScale
          role="button"
          onPress={onNewResearch}
          style={({ pressed }) => [
            styles.newButton,
            theme.touch && { height: TOUCH_TARGET },
            {
              backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
            },
          ]}
        >
          <HoronText variant="label-sm" numberOfLines={1}>
            {newLabel}
          </HoronText>
          <Plus size={14} color={theme.color("text-primary")} />
        </HoronPressable>
      </View>
      <View role="separator" style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />
      <View style={styles.body}>
        <ChatBubble from="me" style={styles.question}>
          {question}
        </ChatBubble>
        {running &&
          (onToggleStatus ? (
            <HoronPressable
              role="button"
              onPress={onToggleStatus}
              accessibilityLiveRegion="polite"
              style={[styles.statusRow, theme.touch && { minHeight: TOUCH_TARGET }]}
            >
              {status}
              <CaretDown size={12} color={theme.color("text-secondary")} />
            </HoronPressable>
          ) : (
            <View accessibilityLiveRegion="polite" style={styles.statusRow}>
              {status}
            </View>
          ))}
        {queries && queries.length > 0 && (
          <View style={styles.queries}>
            <View style={[styles.rail, { backgroundColor: theme.color(RAIL) }]} />
            {queries.map((query, index) => (
              <QueryRow key={query.id} query={query} index={index} />
            ))}
          </View>
        )}
        {sources && sources.length > 0 && (
          <View>
            {onOpenSources ? (
              <HoronPressable
                pressScale
                role="button"
                onPress={onOpenSources}
                style={({ pressed }) => [
                  styles.sources,
                  theme.touch && { height: TOUCH_TARGET },
                  { backgroundColor: theme.color(pressed ? "overlay-ink-8" : "overlay-ink-5") },
                ]}
              >
                {avatars}
                <HoronText variant="label-md" style={styles.sourcesLabel}>
                  {sourcesLabel}
                </HoronText>
                <CaretDown size={12} color={theme.color("text-secondary")} />
              </HoronPressable>
            ) : (
              <View style={[styles.sources, { backgroundColor: theme.color("overlay-ink-5") }]}>
                {avatars}
                <HoronText variant="label-md" style={styles.sourcesLabel}>
                  {sourcesLabel}
                </HoronText>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.composer}>
        <View
          style={[
            styles.followUp,
            { backgroundColor: theme.color(focused ? "overlay-ink-8" : "overlay-ink-5") },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            accessibilityLabel={followUpPlaceholder}
            placeholder={followUpPlaceholder}
            placeholderTextColor={theme.color("text-secondary")}
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={submit}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
            style={[styles.input, fieldText, { color: theme.color("text-primary") }]}
          />
          <HoronPressable
            pressScale
            role="button"
            accessibilityLabel={running ? "Stop" : "Send"}
            onPress={() => {
              if (running) onStop?.();
              else submit();
            }}
            style={({ pressed }) => [
              styles.round,
              theme.touch && { width: TOUCH_TARGET, height: TOUCH_TARGET },
              {
                backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary"),
              },
            ]}
          >
            {running ? (
              <Stop size={14} weight="fill" color={theme.color("text-inverse")} />
            ) : (
              <ArrowUp size={16} color={theme.color("text-inverse")} />
            )}
          </HoronPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 600,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["2"],
    rowGap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["3.5"],
  },
  title: { flex: 1, minWidth: 0 },
  newButton: {
    height: 30,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingLeft: spacing["3.5"],
    paddingRight: spacing["3"],
  },
  divider: { height: 1 },
  body: {
    flexDirection: "column",
    gap: spacing["3"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["4"],
  },
  question: { maxWidth: "85%", alignSelf: "flex-end" },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["1.5"],
    rowGap: spacing["1"],
    borderRadius: radius.md,
  },
  meta: { fontVariant: ["tabular-nums"] },
  caretBar: { width: 2, height: 12, flexShrink: 0, borderRadius: 1 },
  queries: {
    position: "relative",
    flexDirection: "column",
    gap: spacing["2.5"],
    paddingLeft: spacing["3.5"],
    paddingVertical: spacing["0.5"],
  },
  rail: { position: "absolute", left: 0, top: 0, bottom: 0, width: 1.5, borderRadius: radius.full },
  query: { flexDirection: "row", alignItems: "center", gap: spacing["2.5"] },
  queryText: { flex: 1, minWidth: 0 },
  avatars: { flexShrink: 0, flexDirection: "row" },
  avatar: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 2,
  },
  sources: {
    height: 36,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderRadius: radius.full,
    paddingLeft: spacing["1"],
    paddingRight: spacing["3"],
  },
  sourcesLabel: { fontVariant: ["tabular-nums"] },
  composer: {
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["1"],
    paddingBottom: spacing["4"],
  },
  followUp: {
    height: TOUCH_TARGET,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderRadius: radius.full,
    paddingLeft: spacing["4"],
    paddingRight: spacing["1.5"],
  },
  input: { flex: 1, minWidth: 0, paddingVertical: 0, paddingHorizontal: 0, margin: 0 },
  round: {
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
});
