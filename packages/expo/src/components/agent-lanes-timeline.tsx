import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Animated, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretDown, IconContext, Pulse, Warning } from "phosphor-react-native";
import Svg, { Path } from "react-native-svg";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { HoronPressable } from "../lib/press";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/** Bar tone: done is 6% ink, running is 20% live green, failed is 14% red, waiting is an outlined brand bar. */
export type LaneTaskTone = "done" | "running" | "failed" | "waiting";

/** One bar on a bot's row: its label, time range in minutes before the window end, tone and optional badge. */
export type LaneTask = {
  /** Stable key; also how a `LaneHandoff` refers to this task. */
  id: string;
  /** Text inside the bar, truncated when the bar is too narrow. */
  label: ReactNode;
  /** 14px icon before the label. */
  icon?: ReactNode;
  /** Bar fill and text colour. */
  tone: LaneTaskTone;
  /** Minutes before the end of the window, 0 is now: a task from 28 minutes ago to 16 minutes ago is `-28` to `-16`. */
  start: number;
  /** Minutes before the end of the window where the bar ends; must be greater than `start`. */
  end: number;
  /** A pill inside the bar, such as "Needs you". */
  badge?: ReactNode;
};

/** Avatar tint of a bot row: `sky` is sky-500, `steel` sky-700, `neutral` neutral-500 and `ink` the brand fill. */
export type LaneBotTone = "sky" | "steel" | "neutral" | "ink";

/** One lane in the timeline: the bot's identity, its tag and the task bars on its row. */
export type LaneBot = {
  /** Stable key for the row; also the lane order. */
  id: string;
  /** Bot name shown beside the avatar. */
  name: ReactNode;
  /** Second line under the name, such as the tools the bot uses. */
  tools?: ReactNode;
  /** One-character avatar label, usually the first letter of the name. */
  initial: string;
  /** Avatar fill, chosen to keep neighbouring bots distinct. */
  tone: LaneBotTone;
  /** A small tag next to the name: "Idle", "Needs you". */
  badge?: ReactNode;
  /** Tag fill: `ink` is the brand fill, `subtle` the default 6% ink. @default "subtle" */
  badgeTone?: "subtle" | "ink";
  /** Bars on this bot's row; tasks from different bots may overlap in time. */
  tasks: LaneTask[];
};

/** A dashed curve from one task's end to another task's start, such as a hand-off to the next bot. */
export type LaneHandoff = {
  /** Task id the curve starts from. */
  from: string;
  /** Task id the curve ends at. */
  to: string;
};

/** A legend entry in the header: a dot plus a label. */
export type LaneStatus = {
  /** Stable key for the entry. */
  id: string;
  /** `live` paints the dot green, `ink` paints it with the brand fill. */
  tone: "live" | "ink";
  /** Legend text, such as "2 running". */
  label: ReactNode;
};

/** The approval strip below the timeline: one question and its two actions. */
export type AgentLanesTimelineApproval = {
  /** The approval question in the strip at the bottom. */
  message: ReactNode;
  /** Fires when "Later" is pressed. */
  onLater?: () => void;
  /** Fires when "Approve" is pressed. */
  onApprove?: () => void;
};

/** Props for {@link AgentLanesTimeline}: the lanes, the time window and optional header, hand-offs and approval strip. */
export type AgentLanesTimelineProps = {
  /** Panel heading. @default "Bots" */
  title?: ReactNode;
  /** Legend entries shown next to the heading. @default [] */
  statuses?: LaneStatus[];
  /** The range pill at the header's right edge. @default "Last 30m" */
  range?: ReactNode;
  /** One row per bot, in lane order; at least two row heights are always reserved. */
  bots: LaneBot[];
  /** Hand-off curves drawn over the rows; a hand-off naming an unknown task is skipped. @default [] */
  handoffs?: LaneHandoff[];
  /** Window length in minutes; the tick labels sit every five. @default 30 */
  windowMinutes?: number;
  /** Where the current line sits, in minutes before the end of the window. The line glides to a new value in 280ms. @default 0 */
  cursor?: number;
  /** Adds the approval strip below the timeline. */
  approval?: AgentLanesTimelineApproval;
  /** Makes the range pill actionable; without it the range renders as a plain label. */
  onRangeClick?: () => void;
  /** Layout of the panel, for margins or a width override. */
  style?: StyleProp<ViewStyle>;
};

/** The ramp fills of the avatar; the `ink` tone paints the brand token instead. */
const avatarTone: Record<Exclude<LaneBotTone, "ink">, string> = {
  sky: primitives["sky-500"],
  steel: primitives["sky-700"],
  neutral: primitives["neutral-500"],
};

/** The ink tile keeps the inverse label of react's `bg-interactive-primary text-text-inverse`. */
const avatarText: Record<LaneBotTone, ColorToken> = {
  sky: "text-on-ink",
  steel: "text-on-ink",
  neutral: "text-on-ink",
  ink: "text-inverse",
};

const barTone: Record<LaneTaskTone, ColorToken> = {
  done: "overlay-ink-6",
  running: "accent-sky-500-20",
  failed: "accent-red-500-14",
  waiting: "bg-surface-90",
};

const barText: Record<LaneTaskTone, ColorToken> = {
  done: "text-secondary",
  running: "text-primary",
  failed: "text-danger",
  waiting: "text-primary",
};

/** Human word of each bar tone, exposed through the bar's accessibility value. */
const toneWord: Record<LaneTaskTone, string> = {
  done: "Done",
  running: "Running",
  failed: "Failed",
  waiting: "Waiting",
};

const noStatuses: LaneStatus[] = [];
const noHandoffs: LaneHandoff[] = [];

const ROW = 64;
const TOP = 40;
const LABEL_WIDTH = 230;
const RIGHT_GUTTER = 18;
/** Smallest lit span of a hand-off curve, in percent of the track: 9px at the 452px track minimum, 15px at 760px. */
const MIN_CURVE_WIDTH = 2;

/** The four curve paths, named by the corner the curve starts in and the one it ends in. */
const CURVE_PATH = {
  topLeft: "M0 0 C60 0 40 100 100 100",
  bottomLeft: "M0 100 C60 100 40 0 100 0",
  topRight: "M100 0 C40 0 60 100 0 100",
  bottomRight: "M100 100 C40 100 60 0 0 0",
};

/**
 * The box a hand-off curve occupies and the path to draw in it.
 *
 * A hand-off whose tasks meet exactly (one ends where the next starts) would be a zero-width box, and a
 * reverse hand-off (the next task starts before the previous ends) a negative one; both are drawn at the
 * minimum span centred on the point where the tasks meet instead, with the path mirrored so it still leaves
 * the `from` task and arrives at the `to` task.
 */
function handoffCurve(x1: number, x2: number, y1: number, y2: number) {
  const span = (x2 - x1) * 100;
  const width = Math.min(Math.max(Math.abs(span), MIN_CURVE_WIDTH), 100);
  const left = Math.min(Math.max((x1 + x2) * 50 - width / 2, 0), 100 - width);
  const down = y2 >= y1;
  const path = down
    ? span < 0
      ? CURVE_PATH.topRight
      : CURVE_PATH.topLeft
    : span < 0
      ? CURVE_PATH.bottomRight
      : CURVE_PATH.bottomLeft;
  return { left, width, top: Math.min(y1, y2), height: Math.max(Math.abs(y2 - y1), 1), path };
}

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

/**
 * Paper `Agent lanes` (YCO-1): a 24px-radius surface panel with one lane per bot on a shared time axis, a current
 * line, hand-off curves between bots and an approval strip. The current line glides in 280ms with the emphasized
 * easing, rows and bars rise in once, and running bars carry a spinner.
 *
 * The track has a 700px minimum width and scrolls horizontally, so narrow panels stay readable instead of
 * squeezing the bars. Times are minutes before the window's end, not timestamps.
 *
 * React positioned every tick and bar with `calc(230px + (100% - 248px) * fraction)`; React Native resolves the
 * same geometry with a fixed label column and an absolutely filled track whose percentages are its own. The
 * current line needs a real width to animate on the native driver, so the track reports its layout and the
 * line translates by the pixel it computes.
 *
 * @example
 * ```tsx
 * <AgentLanesTimeline
 *   bots={[
 *     {
 *       id: "researcher",
 *       name: "Researcher",
 *       initial: "R",
 *       tone: "sky",
 *       tasks: [{ id: "pull", label: "Pull metrics", tone: "done", start: -28, end: -16 }],
 *     },
 *     {
 *       id: "writer",
 *       name: "Writer",
 *       initial: "W",
 *       tone: "steel",
 *       tasks: [{ id: "draft", label: "Draft summary", tone: "running", start: -16, end: 0 }],
 *     },
 *   ]}
 *   handoffs={[{ from: "pull", to: "draft" }]}
 * />
 * ```
 */
export function AgentLanesTimeline({
  title = "Bots",
  statuses = noStatuses,
  range = "Last 30m",
  bots,
  handoffs = noHandoffs,
  windowMinutes = 30,
  cursor = 0,
  approval,
  onRangeClick,
  style,
}: AgentLanesTimelineProps) {
  const theme = useHoronTheme();
  const barIconDefaults = useMemo(
    () => ({
      done: { color: theme.color("text-secondary"), size: 14 },
      running: { color: theme.color("text-primary"), size: 14 },
      failed: { color: theme.color("text-danger"), size: 14 },
      waiting: { color: theme.color("text-primary"), size: 14 },
    }),
    [theme],
  );
  const ticks = Array.from({ length: windowMinutes / 5 - 1 }, (_, index) => -(windowMinutes - 5 * (index + 1)));
  const at = (minutes: number) => (windowMinutes + minutes) / windowMinutes;
  const taskAt = new Map<string, { task: LaneTask; lane: number }>();
  bots.forEach((bot, lane) => {
    for (const task of bot.tasks) taskAt.set(task.id, { task, lane });
  });
  const height = TOP + Math.max(2, bots.length) * ROW;

  const [trackWidth, setTrackWidth] = useState(0);
  const [cursorX] = useState(() => new Animated.Value(0));
  const placed = useRef(false);

  useEffect(() => {
    if (trackWidth <= 0) return undefined;
    const target = at(-cursor) * trackWidth;
    if (!placed.current || theme.reducedMotion) {
      placed.current = true;
      cursorX.setValue(target);
      return undefined;
    }
    const animation = Animated.timing(cursorX, {
      toValue: target,
      duration: 280,
      easing: easing.emphasized,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
    // `at` is a pure function of `windowMinutes`, which is listed instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, trackWidth, windowMinutes, theme.reducedMotion, cursorX]);

  return (
    <View
      style={[
        styles.panel,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
    >
      <View style={styles.header}>
        <Pulse size={18} color={theme.color("text-primary")} />
        {isPlainText(title) ? (
          <HoronText variant="label-lg">{title}</HoronText>
        ) : (
          <View style={styles.shrink}>{title}</View>
        )}
        {statuses.map((entry) => (
          <View key={entry.id} style={styles.legend}>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[
                styles.legendDot,
                { backgroundColor: theme.color(entry.tone === "live" ? "status-live" : "interactive-primary") },
              ]}
            />
            {isPlainText(entry.label) ? (
              <HoronText variant="body-sm" tone="text-secondary">
                {entry.label}
              </HoronText>
            ) : (
              entry.label
            )}
          </View>
        ))}
        <View style={styles.spacer} />
        {onRangeClick ? (
          <HoronPressable
            role="button"
            pressScale
            onPress={onRangeClick}
            style={({ pressed }) => [
              styles.range,
              { backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6") },
              { minHeight: theme.touch ? TOUCH_TARGET : 30 },
            ]}
          >
            {isPlainText(range) ? <HoronText variant="label-sm">{range}</HoronText> : range}
            <CaretDown size={12} color={theme.color("text-secondary")} />
          </HoronPressable>
        ) : (
          <View style={[styles.range, { backgroundColor: theme.color("overlay-ink-6"), height: 30 }]}>
            {isPlainText(range) ? <HoronText variant="label-sm">{range}</HoronText> : range}
            <CaretDown size={12} color={theme.color("text-secondary")} />
          </View>
        )}
      </View>
      <View style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.canvas, { height }]}>
          {bots.map((bot, lane) => (
            <Rise
              key={bot.id}
              delay={lane * 30}
              style={[
                styles.lane,
                {
                  top: TOP + lane * ROW,
                  borderBottomWidth: lane < bots.length - 1 ? 1 : 0,
                  borderBottomColor: theme.color("overlay-ink-6"),
                },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: bot.tone === "ink" ? theme.color("interactive-primary") : avatarTone[bot.tone] },
                ]}
              >
                <HoronText variant="label-md" tone={avatarText[bot.tone]}>
                  {bot.initial}
                </HoronText>
              </View>
              <View style={styles.laneText}>
                <View style={styles.laneName}>
                  {isPlainText(bot.name) ? (
                    <HoronText variant="label-md" numberOfLines={1} style={styles.shrink}>
                      {bot.name}
                    </HoronText>
                  ) : (
                    <View style={styles.shrink}>{bot.name}</View>
                  )}
                  {bot.badge ? (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: theme.color(
                            bot.badgeTone === "ink" ? "interactive-primary" : "overlay-ink-6",
                          ),
                        },
                      ]}
                    >
                      {isPlainText(bot.badge) ? (
                        <HoronText
                          variant="label-sm"
                          tone={bot.badgeTone === "ink" ? "text-inverse" : "text-secondary"}
                        >
                          {bot.badge}
                        </HoronText>
                      ) : (
                        bot.badge
                      )}
                    </View>
                  ) : null}
                </View>
                {bot.tools ? (
                  isPlainText(bot.tools) ? (
                    <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                      {bot.tools}
                    </HoronText>
                  ) : (
                    <View style={styles.shrink}>{bot.tools}</View>
                  )
                ) : null}
              </View>
            </Rise>
          ))}

          <View style={styles.track} onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
            {ticks.map((minutes) => (
              <View key={minutes} style={[styles.tick, { left: `${at(minutes) * 100}%` }]}>
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={[styles.tickLine, { backgroundColor: theme.color("overlay-ink-5") }]}
                />
                <View style={styles.tickLabel}>
                  <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                    {`${minutes}m`}
                  </HoronText>
                </View>
              </View>
            ))}

            {handoffs.map(({ from, to }) => {
              const a = taskAt.get(from);
              const b = taskAt.get(to);
              if (!a || !b) return null;
              const curve = handoffCurve(
                at(a.task.end),
                at(b.task.start),
                TOP + a.lane * ROW + 32,
                TOP + b.lane * ROW + 32,
              );
              return (
                <View
                  key={`${from}-${to}`}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={[
                    styles.curve,
                    {
                      left: `${curve.left}%`,
                      width: `${curve.width}%`,
                      top: curve.top,
                      height: curve.height,
                    },
                  ]}
                >
                  <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <Path
                      d={curve.path}
                      fill="none"
                      stroke={theme.color("status-live")}
                      strokeWidth={1.5}
                      strokeDasharray={[3, 3]}
                      vectorEffect="non-scaling-stroke"
                    />
                  </Svg>
                </View>
              );
            })}

            {bots.flatMap((bot, lane) =>
              bot.tasks.map((task) => (
                <Rise
                  key={task.id}
                  style={[
                    styles.bar,
                    {
                      top: TOP + lane * ROW + 14,
                      left: `${at(task.start) * 100}%`,
                      width: `${((task.end - task.start) / windowMinutes) * 100}%`,
                      backgroundColor: theme.color(barTone[task.tone]),
                      borderWidth: task.tone === "waiting" ? 1 : 0,
                      borderColor: theme.color("interactive-primary"),
                    },
                  ]}
                >
                  <View
                    accessible
                    accessibilityLabel={isPlainText(task.label) ? String(task.label) : undefined}
                    accessibilityValue={{ text: toneWord[task.tone] }}
                    style={styles.barRow}
                  >
                    {task.icon ? (
                      <IconContext.Provider value={barIconDefaults[task.tone]}>
                        <View style={styles.barIcon}>{task.icon}</View>
                      </IconContext.Provider>
                    ) : null}
                    {isPlainText(task.label) ? (
                      <HoronText variant="label-sm" tone={barText[task.tone]} numberOfLines={1} style={styles.barText}>
                        {task.label}
                      </HoronText>
                    ) : (
                      <View style={styles.barText}>{task.label}</View>
                    )}
                    {task.badge ? (
                      <View style={[styles.barBadge, { backgroundColor: theme.color("interactive-primary") }]}>
                        {isPlainText(task.badge) ? (
                          <HoronText variant="label-sm" tone="text-inverse">
                            {task.badge}
                          </HoronText>
                        ) : (
                          task.badge
                        )}
                      </View>
                    ) : null}
                    {task.tone === "running" ? <Spinner size={12} label="Running" /> : null}
                  </View>
                </Rise>
              )),
            )}

            <Animated.View style={[styles.cursor, { transform: [{ translateX: cursorX }] }]}>
              <View
                accessible
                role="progressbar"
                accessibilityLabel="Now"
                accessibilityValue={{ min: -windowMinutes, max: 0, now: -cursor }}
                style={[styles.nowLabel, { backgroundColor: theme.color("accent-sky-500-20") }]}
              >
                <HoronText variant="caption" tone="text-secondary">
                  now
                </HoronText>
              </View>
              <View style={[styles.nowLine, { backgroundColor: theme.color("accent-sky-500-60") }]} />
            </Animated.View>
          </View>
        </View>
      </ScrollView>

      {approval ? (
        <>
          <View style={[styles.divider, { backgroundColor: theme.color("overlay-ink-8") }]} />
          <View style={styles.approval}>
            <Warning size={14} color={theme.color("text-primary")} />
            <View style={styles.approvalMessage}>
              {isPlainText(approval.message) ? (
                <HoronText variant="body-sm">{approval.message}</HoronText>
              ) : (
                approval.message
              )}
            </View>
            <HoronPressable
              role="button"
              pressScale
              onPress={approval.onLater}
              style={({ pressed }) => [
                styles.approvalAction,
                {
                  backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
                  minHeight: theme.touch ? TOUCH_TARGET : 30,
                },
              ]}
            >
              <HoronText variant="label-sm">Later</HoronText>
            </HoronPressable>
            <HoronPressable
              role="button"
              pressScale
              onPress={approval.onApprove}
              style={({ pressed }) => [
                styles.approvalAction,
                {
                  backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary"),
                  minHeight: theme.touch ? TOUCH_TARGET : 30,
                },
              ]}
            >
              <HoronText variant="label-sm" tone="text-inverse">
                Approve
              </HoronText>
            </HoronPressable>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 1010,
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
  legend: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  legendDot: { width: 7, height: 7, borderRadius: radius.full },
  spacer: { flex: 1 },
  shrink: { minWidth: 0, flexShrink: 1 },
  range: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
  divider: { height: 1 },
  canvas: { minWidth: 700, position: "relative" },
  track: { position: "absolute", top: 0, bottom: 0, left: LABEL_WIDTH, right: RIGHT_GUTTER },
  tick: { position: "absolute", top: 0, bottom: 0, width: 0 },
  tickLine: { position: "absolute", top: 36, bottom: 0, width: 1 },
  tickLabel: { position: "absolute", top: 10, width: 40, marginLeft: -20, alignItems: "center" },
  lane: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ROW,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    paddingLeft: spacing["5"],
  },
  avatar: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  laneText: { flexDirection: "column", width: LABEL_WIDTH - 66 },
  laneName: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  badge: { borderRadius: radius.md, paddingHorizontal: spacing["1.5"], paddingVertical: 1 },
  curve: { position: "absolute" },
  bar: {
    position: "absolute",
    height: 36,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  barRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    paddingHorizontal: spacing["2.5"],
  },
  barIcon: { flexShrink: 0 },
  barText: { flex: 1, minWidth: 0 },
  barBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1"],
    borderRadius: radius.full,
    paddingLeft: spacing["1.5"],
    paddingRight: spacing["2"],
    paddingVertical: 2,
  },
  cursor: { position: "absolute", top: 0, bottom: 0, left: 0, width: 1 },
  nowLabel: {
    position: "absolute",
    top: 10,
    right: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing["1.5"],
    paddingVertical: 1,
  },
  nowLine: { position: "absolute", top: 36, bottom: 0, width: 1.5 },
  approval: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing["3"],
    paddingHorizontal: spacing["5"],
    paddingVertical: spacing["3"],
  },
  approvalMessage: { flex: 1, minWidth: 0 },
  approvalAction: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
});
