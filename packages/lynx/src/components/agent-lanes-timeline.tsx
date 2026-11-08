import { useMemo, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";
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

/** Props of the native `section` react spread onto the panel; Lynx has no such element, so it is a `view`. */
type PortedSectionAttributes = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the panel's own. */
  style?: CSSProperties;
};

/** Props for {@link AgentLanesTimeline}: the lanes, the time window and optional header, hand-offs and approval strip. */
export type AgentLanesTimelineProps = Omit<PortedSectionAttributes, "className"> & {
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
  /** Extra classes merged onto the panel, for margins or a width override. */
  className?: string;
};

const avatarTone: Record<LaneBotTone, string> = {
  sky: "bg-sky-500",
  steel: "bg-sky-700",
  neutral: "bg-neutral-500",
  ink: "bg-interactive-primary",
};

/** React coloured the ink tile's initial with `text-text-inverse`; every other tone reads on-ink. */
const avatarText: Record<LaneBotTone, string> = {
  sky: "text-text-on-ink",
  steel: "text-text-on-ink",
  neutral: "text-text-on-ink",
  ink: "text-text-inverse",
};

const barTone: Record<LaneTaskTone, string> = {
  done: "bg-overlay-ink-6",
  running: "bg-accent-sky-500-20",
  failed: "bg-accent-red-500-14",
  waiting: "border border-interactive-primary bg-bg-surface-90",
};

/** React painted the bar's label with the tone's text colour; Lynx colours each `<text>` itself. */
const barText: Record<LaneTaskTone, string> = {
  done: "text-text-secondary",
  running: "text-text-primary",
  failed: "text-text-danger",
  waiting: "text-text-primary",
};

const noStatuses: LaneStatus[] = [];
const noHandoffs: LaneHandoff[] = [];

const ROW = 64;
const TOP = 40;
const LABEL_WIDTH = 230;
const RIGHT_GUTTER = 18;

/** Smallest lit span of a hand-off curve, in percent of the track: 9px at the 452px track minimum, 15px at 760px. */
const MIN_CURVE_WIDTH = 2;

/**
 * The four curve paths, named by the corner the curve starts in and the one it ends in: a hand-off that runs
 * left to right and down is `topLeft`, the reverse direction is `topRight`, and a target lane above the source
 * flips the vertical ends.
 */
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
 * the `from` task and arrives at the `to` task. A target lane above the source flips the curve vertically the
 * same way, so the box never has a negative height.
 */
const handoffCurve = (x1: number, x2: number, y1: number, y2: number) => {
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
};

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Paper `Agent lanes` (YCO-1): a 24px-radius surface panel with one lane per bot on a shared time axis, a
 * current line, hand-off curves between bots and an approval strip. The current line glides in 280ms with the
 * emphasized easing, rows tint on press in 150ms, and running bars carry a spinner.
 *
 * The track has a 700px minimum width and scrolls horizontally, so narrow panels stay readable instead of
 * squeezing the bars. Times are minutes before the window's end, not timestamps.
 *
 * React positioned every tick and bar with `calc(230px + (100% - 248px) * fraction)`. Lynx resolves the same
 * geometry with two nested boxes instead: a 230px label column and a `flex-1` track overlay whose percentages
 * are the track's own, which also keeps the hand-off SVG the size of the curve it draws.
 *
 * @example
 * ```tsx
 * import { AgentLanesTimeline } from "@horon-ai/lynx";
 *
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
  className,
  id,
  style,
}: AgentLanesTimelineProps) {
  const theme = useHoronTheme();
  const ticks = Array.from({ length: windowMinutes / 5 - 1 }, (_, i) => -(windowMinutes - 5 * (i + 1)));
  const taskAt = useMemo(() => {
    const map = new Map<string, { task: LaneTask; lane: number }>();
    bots.forEach((bot, lane) => {
      for (const task of bot.tasks) map.set(task.id, { task, lane });
    });
    return map;
  }, [bots]);
  const at = (minutes: number) => (windowMinutes + minutes) / windowMinutes;
  const lanes = Math.max(2, bots.length);
  const height = TOP + lanes * ROW;

  /** The dashed hand-off curves, drawn as one SVG path each in a box the size of the curve. */
  const curves = handoffs.flatMap(({ from, to }) => {
    const a = taskAt.get(from);
    const b = taskAt.get(to);
    if (!a || !b) return [];
    const x1 = at(a.task.end);
    const x2 = at(b.task.start);
    const y1 = TOP + a.lane * ROW + 32;
    const y2 = TOP + b.lane * ROW + 32;
    return [{ key: `${from}-${to}`, ...handoffCurve(x1, x2, y1, y2) }];
  });

  return (
    <view
      className={cn(
        "flex w-full min-w-0 max-w-[1010px] flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex flex-row flex-wrap items-center gap-x-2.5 gap-y-2 px-5 pb-3.5 pt-4">
        <Icon name="Pulse" size={18} color="text-primary" />
        {isPlainText(title) ? (
          <text className="min-w-0 text-label-lg text-text-primary">{title}</text>
        ) : (
          <view className="min-w-0">{title}</view>
        )}
        {statuses.map((entry) => (
          <view key={entry.id} className="flex flex-row items-center gap-1.5">
            <view
              className={cn(
                "size-[7px] rounded-full",
                entry.tone === "live" ? "bg-status-live" : "bg-interactive-primary",
              )}
              accessibility-elements-hidden
            />
            {isPlainText(entry.label) ? (
              <text className="text-body-sm text-text-secondary">{entry.label}</text>
            ) : (
              entry.label
            )}
          </view>
        ))}
        <view className="flex-1" />
        {onRangeClick ? (
          <view
            className="motion-press flex h-[30px] flex-row items-center gap-1 rounded-full bg-overlay-ink-6 px-3 active:bg-overlay-ink-10"
            bindtap={onRangeClick}
            accessibility-element
            accessibility-traits="button"
          >
            {isPlainText(range) ? <text className="text-label-sm text-text-primary">{range}</text> : range}
            <Icon name="CaretDown" size={12} color="text-secondary" />
          </view>
        ) : (
          <view className="flex h-[30px] flex-row items-center gap-1 rounded-full bg-overlay-ink-6 px-3">
            {isPlainText(range) ? <text className="text-label-sm text-text-primary">{range}</text> : range}
            <Icon name="CaretDown" size={12} color="text-secondary" />
          </view>
        )}
      </view>
      <view className="h-px bg-overlay-ink-8" accessibility-role-description="separator" />

      <scroll-view scroll-orientation="horizontal" className="w-full" scroll-bar-enable={false}>
        <view className="relative w-full" style={{ minWidth: "700px", height: `${height}px` }}>
          {/* Lane rows: avatar, name and tag, with a divider between rows. */}
          {bots.map((bot, lane) => (
            <view
              key={bot.id}
              className={cn(
                "motion-rise motion-colors absolute flex flex-row items-center gap-3 pl-5 active:bg-overlay-ink-3",
                lane < bots.length - 1 && "border-b border-overlay-ink-6",
              )}
              style={{
                top: `${TOP + lane * ROW}px`,
                left: 0,
                right: 0,
                height: `${ROW}px`,
                animationDelay: `${lane * 30}ms`,
              }}
            >
              <view
                className={cn(
                  "flex size-[34px] shrink-0 flex-row items-center justify-center rounded-[10px]",
                  avatarTone[bot.tone],
                )}
              >
                <text className={cn("text-label-md", avatarText[bot.tone])}>{bot.initial}</text>
              </view>
              <view className="flex flex-col" style={{ width: `${LABEL_WIDTH - 66}px` }}>
                <view className="flex flex-row items-center gap-1.5">
                  {isPlainText(bot.name) ? (
                    <text className="truncate text-label-md text-text-primary">{bot.name}</text>
                  ) : (
                    <view className="min-w-0">{bot.name}</view>
                  )}
                  {bot.badge ? (
                    <view
                      className={cn(
                        "rounded-md px-1.5 py-px",
                        bot.badgeTone === "ink" ? "bg-interactive-primary" : "bg-overlay-ink-6",
                      )}
                    >
                      {isPlainText(bot.badge) ? (
                        <text
                          className={cn(
                            "text-label-sm",
                            bot.badgeTone === "ink" ? "text-text-inverse" : "text-text-secondary",
                          )}
                        >
                          {bot.badge}
                        </text>
                      ) : (
                        bot.badge
                      )}
                    </view>
                  ) : null}
                </view>
                {bot.tools ? (
                  isPlainText(bot.tools) ? (
                    <text className="truncate text-caption text-text-secondary">{bot.tools}</text>
                  ) : (
                    <view className="min-w-0">{bot.tools}</view>
                  )
                ) : null}
              </view>
            </view>
          ))}

          {/* The track: ticks, bars, hand-offs and the current line, all sized as a share of its own width. */}
          <view
            className="absolute"
            style={{ top: 0, bottom: 0, left: `${LABEL_WIDTH}px`, right: `${RIGHT_GUTTER}px` }}
          >
            {ticks.map((minutes) => {
              const left = `${at(minutes) * 100}%`;
              return (
                <view key={minutes} accessibility-elements-hidden>
                  <view className="absolute bottom-0 top-9 w-px bg-overlay-ink-5" style={{ left }} />
                  <view className="absolute top-2.5" style={{ left, transform: "translateX(-50%)" }}>
                    <text className="whitespace-nowrap text-caption text-text-secondary">{`${minutes}m`}</text>
                  </view>
                </view>
              );
            })}

            {curves.map((curve) => (
              <view
                key={curve.key}
                className="absolute"
                accessibility-elements-hidden
                style={{
                  left: `${curve.left}%`,
                  width: `${curve.width}%`,
                  top: `${curve.top}px`,
                  height: `${curve.height}px`,
                }}
              >
                <svg
                  content={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none"><path d="${curve.path}" stroke="${theme.color("status-live")}" stroke-width="1.5" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/></svg>`}
                  style={{ width: "100%", height: "100%" }}
                />
              </view>
            ))}

            {bots.flatMap((bot, lane) =>
              bot.tasks.map((task) => (
                <view
                  key={task.id}
                  className={cn(
                    "motion-rise absolute flex h-9 flex-row items-center gap-1.5 overflow-hidden rounded-[10px] px-2.5",
                    barTone[task.tone],
                  )}
                  style={{
                    top: `${TOP + lane * ROW + 14}px`,
                    left: `${at(task.start) * 100}%`,
                    width: `${((task.end - task.start) / windowMinutes) * 100}%`,
                  }}
                >
                  {task.icon ? <view className="flex shrink-0">{task.icon}</view> : null}
                  {isPlainText(task.label) ? (
                    <text className={cn("min-w-0 flex-1 truncate text-label-sm", barText[task.tone])}>
                      {task.label}
                    </text>
                  ) : (
                    <view className="min-w-0 flex-1">{task.label}</view>
                  )}
                  {task.badge ? (
                    <view className="flex flex-row items-center gap-1 rounded-full bg-interactive-primary py-0.5 pl-1.5 pr-2">
                      {isPlainText(task.badge) ? (
                        <text className="text-label-sm text-text-inverse">{task.badge}</text>
                      ) : (
                        task.badge
                      )}
                    </view>
                  ) : null}
                  {task.tone === "running" ? <Spinner size={12} label="Running" /> : null}
                </view>
              )),
            )}

            <view
              className="absolute top-2.5"
              style={{ left: `${at(-cursor) * 100}%`, transform: "translateX(-100%)" }}
            >
              <view className="rounded-md bg-accent-sky-500-20 px-1.5 py-px">
                <text className="text-caption text-text-secondary">now</text>
              </view>
            </view>
            <view
              className="absolute bottom-0 top-9 w-[1.5px] bg-accent-sky-500-60"
              style={{ left: `${at(-cursor) * 100}%` }}
            />
          </view>
        </view>
      </scroll-view>

      {approval ? (
        <>
          <view className="h-px bg-overlay-ink-8" accessibility-role-description="separator" />
          <view className="flex flex-row flex-wrap items-center gap-3 px-5 py-3">
            <Icon name="Warning" size={14} color="text-primary" />
            {isPlainText(approval.message) ? (
              <text className="min-w-0 flex-1 text-body-sm text-text-primary">{approval.message}</text>
            ) : (
              <view className="min-w-0 flex-1">{approval.message}</view>
            )}
            <view
              className="motion-press flex h-[30px] shrink-0 flex-row items-center rounded-full bg-overlay-ink-6 px-3 active:bg-overlay-ink-10"
              bindtap={approval.onLater}
              accessibility-element
              accessibility-traits="button"
            >
              <text className="text-label-sm text-text-primary">Later</text>
            </view>
            <view
              className="motion-press flex h-[30px] shrink-0 flex-row items-center rounded-full bg-interactive-primary px-3 active:bg-interactive-primary-hover"
              bindtap={approval.onApprove}
              accessibility-element
              accessibility-traits="button"
            >
              <text className="text-label-sm text-text-inverse">Approve</text>
            </view>
          </view>
        </>
      ) : null}
    </view>
  );
}
