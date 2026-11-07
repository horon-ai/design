import { CaretDown, Pulse, Warning } from "@phosphor-icons/react";
import { type ComponentProps, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
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
export type AgentLanesTimelineProps = Omit<ComponentProps<"section">, "className" | "title"> & {
  /** Panel heading. @default "Bots" */
  title?: ReactNode;
  /** Legend entries shown next to the heading. */
  statuses?: LaneStatus[];
  /** The range pill at the header's right edge. @default "Last 30m" */
  range?: ReactNode;
  /** One row per bot, in lane order; at least two row heights are always reserved. */
  bots: LaneBot[];
  /** Hand-off curves drawn over the rows; a hand-off naming an unknown task is skipped. */
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
  ink: "bg-interactive-primary text-text-inverse",
};

const barTone: Record<LaneTaskTone, string> = {
  done: "bg-overlay-ink-6 text-text-secondary",
  running: "bg-status-live/20 text-text-primary",
  failed: "bg-red-500/14 text-text-danger",
  waiting: "border border-interactive-primary bg-bg-surface-90 text-text-primary",
};

const noStatuses: LaneStatus[] = [];
const noHandoffs: LaneHandoff[] = [];
type RowStyle = CSSProperties & {
  /** Lane index, consumed by the staggered `motion-rise` delay. */
  "--i": number;
};
const rowStyle = (lane: number): RowStyle => ({ top: TOP + lane * ROW, height: ROW, "--i": lane });

const ROW = 64;
const TOP = 40;
const LABEL_WIDTH = 230;
const RIGHT_GUTTER = 18;

const TRACK = `(100% - ${LABEL_WIDTH + RIGHT_GUTTER}px)`;
const trackX = (fraction: number) => `calc(${LABEL_WIDTH}px + ${TRACK} * ${fraction})`;
const trackW = (fraction: number) => `calc(${TRACK} * ${fraction})`;

/**
 * Paper `Agent lanes` (YCO-1): a 24px-radius surface panel with one lane per bot on a shared time axis, a current
 * line, hand-off curves between bots and an approval strip. The current line glides in 280ms with the emphasized
 * easing, rows tint on hover in 150ms, and running bars carry a spinner.
 *
 * The track has a 700px minimum width and scrolls horizontally, so narrow panels stay readable instead of
 * squeezing the bars. Times are minutes before the window's end, not timestamps.
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
  className,
  ...props
}: AgentLanesTimelineProps) {
  const ticks = Array.from({ length: windowMinutes / 5 - 1 }, (_, i) => -(windowMinutes - 5 * (i + 1)));
  const taskAt = new Map<
    string,
    {
      /** The task the hand-off refers to. */
      task: LaneTask;
      /** Lane index of the bot that owns the task, used for the curve's vertical endpoints. */
      lane: number;
    }
  >();
  bots.forEach((bot, lane) => {
    for (const task of bot.tasks) taskAt.set(task.id, { task, lane });
  });
  const at = (minutes: number) => (windowMinutes + minutes) / windowMinutes;

  return (
    <section
      className={cn(
        "flex w-full max-w-252.5 min-w-0 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 px-5 pt-4 pb-3.5">
        <Pulse aria-hidden className="size-4.5 shrink-0 text-text-primary" />
        <h3 className="min-w-0 text-label-lg text-text-primary">{title}</h3>
        {statuses.map((status) => (
          <span key={status.id} className="flex items-center gap-1.5 text-body-sm text-text-secondary">
            <span
              aria-hidden
              className={cn(
                "size-1.75 rounded-full",
                status.tone === "live" ? "bg-status-live" : "bg-interactive-primary",
              )}
            />
            {status.label}
          </span>
        ))}
        <span className="flex-1" />
        {onRangeClick ? (
          <button
            type="button"
            onClick={onRangeClick}
            className="flex h-7.5 motion-press cursor-pointer items-center gap-1 rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            {range}
            <CaretDown aria-hidden className="size-3 text-text-secondary" />
          </button>
        ) : (
          <span className="flex h-7.5 items-center gap-1 rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary">
            {range}
            <CaretDown aria-hidden className="size-3 text-text-secondary" />
          </span>
        )}
      </div>
      <div className="h-px bg-overlay-ink-8" />

      <div className="overflow-x-auto">
        <div className="relative min-w-175" style={{ height: TOP + Math.max(2, bots.length) * ROW }}>
          {ticks.map((minutes) => (
            <span key={minutes}>
              <span
                aria-hidden
                className="absolute top-9 bottom-0 w-px bg-overlay-ink-5"
                style={{ left: trackX(at(minutes)) }}
              />
              <span
                className="absolute top-2.5 -translate-x-1/2 text-caption whitespace-nowrap text-text-secondary"
                style={{ left: trackX(at(minutes)) }}
              >
                {minutes}m
              </span>
            </span>
          ))}

          {bots.map((bot, lane) => (
            <div
              key={bot.id}
              style={rowStyle(lane)}
              className={cn(
                "absolute inset-x-0 flex motion-rise items-center gap-3 pl-5 motion-colors hover:bg-overlay-ink-3",
                lane < bots.length - 1 && "border-b border-overlay-ink-6",
              )}
            >
              <span
                className={cn(
                  "flex size-8.5 shrink-0 items-center justify-center rounded-[10px] text-label-md text-text-on-ink",
                  avatarTone[bot.tone],
                )}
              >
                {bot.initial}
              </span>
              <span className="flex flex-col">
                <span className="flex items-center gap-1.5 text-label-md text-text-primary">
                  {bot.name}
                  {bot.badge && (
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-px text-label-sm",
                        bot.badgeTone === "ink"
                          ? "bg-interactive-primary text-text-inverse"
                          : "bg-overlay-ink-6 text-text-secondary",
                      )}
                    >
                      {bot.badge}
                    </span>
                  )}
                </span>
                {bot.tools && <span className="text-caption text-text-secondary">{bot.tools}</span>}
              </span>
            </div>
          ))}

          {handoffs.map(({ from, to }) => {
            const a = taskAt.get(from);
            const b = taskAt.get(to);
            if (!a || !b) return null;
            const x1 = at(a.task.end);
            const x2 = at(b.task.start);
            const y1 = TOP + a.lane * ROW + 32;
            const y2 = TOP + b.lane * ROW + 32;
            return (
              <span
                key={`${from}-${to}`}
                aria-hidden
                className="absolute"
                style={{
                  left: trackX(x1),
                  width: trackW(x2 - x1),
                  top: y1,
                  height: y2 - y1,
                }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full overflow-visible">
                  <path
                    d="M0 0 C60 0 40 100 100 100"
                    fill="none"
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                    className="stroke-status-live"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
            );
          })}

          {bots.flatMap((bot, lane) =>
            bot.tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "absolute flex h-9 motion-rise items-center gap-1.5 overflow-clip rounded-[10px] px-2.5 text-label-sm transition-[left,width,background-color,color,border-color] duration-280 ease-emphasized [&>svg]:size-3.5",
                  barTone[task.tone],
                )}
                style={{
                  top: TOP + lane * ROW + 14,
                  left: trackX(at(task.start)),
                  width: trackW((task.end - task.start) / windowMinutes),
                }}
              >
                {task.icon}
                <span className="min-w-0 flex-1 truncate">{task.label}</span>
                {task.badge && (
                  <span className="flex items-center gap-1 rounded-full bg-interactive-primary py-0.5 pr-2 pl-1.5 text-label-sm text-text-inverse [&>svg]:size-3">
                    {task.badge}
                  </span>
                )}
                {task.tone === "running" && <Spinner size={12} label="Running" />}
              </div>
            )),
          )}

          <span
            className="absolute top-2.5 -translate-x-full transition-[left] duration-280 ease-emphasized"
            style={{ left: trackX(at(-cursor)) }}
          >
            <span className="rounded-md bg-status-live/20 px-1.5 py-px text-caption text-text-secondary">now</span>
          </span>
          <span
            aria-hidden
            className="absolute top-9 bottom-0 w-[1.5px] bg-status-live/60 transition-[left] duration-280 ease-emphasized"
            style={{ left: trackX(at(-cursor)) }}
          />
        </div>
      </div>

      {approval && (
        <>
          <div className="h-px bg-overlay-ink-8" />
          <div className="flex flex-wrap items-center gap-3 px-5 py-3">
            <Warning aria-hidden className="size-3.5 shrink-0 text-text-primary" />
            <p className="min-w-0 flex-1 text-body-sm text-text-primary">{approval.message}</p>
            <button
              type="button"
              onClick={approval.onLater}
              className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              Later
            </button>
            <button
              type="button"
              onClick={approval.onApprove}
              className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center rounded-full bg-interactive-primary px-3 text-label-sm text-text-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
            >
              Approve
            </button>
          </div>
        </>
      )}
    </section>
  );
}
