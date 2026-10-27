import { CaretDown, Sparkle, Warning } from "@phosphor-icons/react";
import { type ComponentProps, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type LaneTaskTone = "done" | "running" | "failed" | "waiting";

export type LaneTask = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  tone: LaneTaskTone;
  /** Minutes before the end of the window, 0 is now: a task from 28 minutes ago to 16 minutes ago is `-28` to `-16`. */
  start: number;
  end: number;
  /** A pill inside the bar, such as "Needs you". */
  badge?: ReactNode;
};

export type LaneBotTone = "sky" | "steel" | "neutral" | "ink";

export type LaneBot = {
  id: string;
  name: ReactNode;
  tools?: ReactNode;
  initial: string;
  tone: LaneBotTone;
  /** A small tag next to the name: "Idle", "Needs you". */
  badge?: ReactNode;
  badgeTone?: "subtle" | "ink";
  tasks: LaneTask[];
};

export type LaneHandoff = { from: string; to: string };

export type LaneStatus = { id: string; tone: "live" | "ink"; label: ReactNode };

export type AgentLanesTimelineApproval = {
  message: ReactNode;
  onLater?: () => void;
  onApprove?: () => void;
};

export type AgentLanesTimelineProps = Omit<ComponentProps<"section">, "className" | "title"> & {
  title?: ReactNode;
  statuses?: LaneStatus[];
  /** The range pill at the header's right edge. */
  range?: ReactNode;
  bots: LaneBot[];
  handoffs?: LaneHandoff[];
  /** Window length in minutes; the tick labels sit every five. */
  windowMinutes?: number;
  /** Where the current line sits, in minutes before the end of the window. The line glides to a new value in 280ms. */
  cursor?: number;
  approval?: AgentLanesTimelineApproval;
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
type RowStyle = CSSProperties & { "--i": number };
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
  className,
  ...props
}: AgentLanesTimelineProps) {
  const ticks = Array.from({ length: windowMinutes / 5 - 1 }, (_, i) => -(windowMinutes - 5 * (i + 1)));
  const taskAt = new Map<string, { task: LaneTask; lane: number }>();
  bots.forEach((bot, lane) => {
    for (const task of bot.tasks) taskAt.set(task.id, { task, lane });
  });
  const at = (minutes: number) => (windowMinutes + minutes) / windowMinutes;

  return (
    <section
      className={cn(
        "flex w-full max-w-252.5 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 pt-4 pr-4.5 pb-3.5 pl-4.5">
        <Sparkle aria-hidden className="size-4.5 shrink-0 text-text-primary" />
        <h3 className="text-label-lg text-text-primary">{title}</h3>
        {statuses.map((status) => (
          <span key={status.id} className="flex items-center gap-1.5 text-body-sm text-text-secondary">
            <span
              aria-hidden
              className={cn("size-1.75 rounded-full", status.tone === "live" ? "bg-status-live" : "bg-interactive-primary")}
            />
            {status.label}
          </span>
        ))}
        <span className="flex-1" />
        <button
          type="button"
          className="flex h-7 motion-press cursor-pointer items-center gap-1 rounded-full bg-overlay-ink-6 px-2.5 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          {range}
          <CaretDown aria-hidden className="size-3 text-text-secondary" />
        </button>
      </div>
      <div className="h-px bg-overlay-ink-8" />

      <div className="overflow-x-auto">
        <div className="relative h-76 min-w-250">
          {ticks.map((minutes) => (
            <span key={minutes}>
              <span
                aria-hidden
                className="absolute top-9 h-67 w-px bg-overlay-ink-5"
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
                "motion-rise absolute inset-x-0 flex items-center gap-3 pl-4.5 motion-colors hover:bg-overlay-ink-3",
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
                  "absolute flex h-9 items-center gap-1.5 overflow-clip rounded-[10px] px-2.5 text-label-sm motion-colors [&>svg]:size-3.5",
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
            className="absolute top-9 h-67 w-[1.5px] bg-status-live/60 transition-[left] duration-280 ease-emphasized"
            style={{ left: trackX(at(-cursor)) }}
          />
        </div>
      </div>

      {approval && (
        <>
          <div className="h-px bg-overlay-ink-8" />
          <div className="flex items-center gap-3 px-4.5 py-3">
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
