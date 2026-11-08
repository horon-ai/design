import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/** Lifecycle of the lane: `running` shows a spinner and a pulsing tile, `done` a check, `failed` a warning and a danger rim. */
export type AgentLaneStatus = "running" | "done" | "failed";

/** Props for {@link AgentLane}: the sub-agent identity, its task, and the optional tool, output, usage and timing lines. */
export type AgentLaneProps = {
  /** Lifecycle state; also picks the tile shade (sky-400, sky-600, sky-800) and the result icon. */
  status: AgentLaneStatus;
  /** Identity of the sub-agent shown in the header. */
  bot: {
    /** One-character tile label, usually the first letter of the name. */
    initial: string;
    /** Display name, truncated when the header runs out of room. */
    name: ReactNode;
  };
  /** Duration, such as "1.9s". */
  elapsed?: ReactNode;
  /** The short task line under the header, wrapping onto several lines. */
  task: ReactNode;
  /** 14px tool icon and source, such as "Notion · Q3 metrics dashboard". */
  tool?: {
    /** Tool icon, sized 14px by the row. */
    icon: ReactNode;
    /** Tool and source description, truncated to one line. */
    label: ReactNode;
  };
  /** Latest output, or the error when failed. */
  output?: ReactNode;
  /** Usage caption, such as "2.6k tokens". */
  usage?: ReactNode;
  /** Extra classes merged onto the card, for layout inside a lane grid. */
  className?: string;
};

const botTile: Record<AgentLaneStatus, string> = {
  running: "bg-sky-400",
  done: "bg-sky-600",
  failed: "bg-sky-800",
};

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The Figma quint curve the live pulse runs, written out because an inline style cannot read a variable. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Figma `Agent lane` (Agent orchestrator 113:953): one sub-agent's card in a fan-out, flat subtle with a red
 * rim on failure.
 *
 * Lynx has no `animate-live-pulse` utility, so the running tile's ring is drawn inline; the ring follows
 * `currentColor`, which the wrapper sets to the tile's sky tone, exactly as react's wrapper did. Each text
 * slot is its own `<text>`, because Lynx colours do not inherit from the card.
 *
 * @example
 * ```tsx
 * import { AgentLane, Icon } from "@horon-ai/lynx";
 *
 * <AgentLane
 *   status="running"
 *   bot={{ initial: "R", name: "Researcher" }}
 *   task="Gather the Q3 metrics"
 *   tool={{ icon: <Icon name="MagnifyingGlass" />, label: "Notion · Q3 metrics dashboard" }}
 *   elapsed="1.9s"
 * />
 * ```
 */
export function AgentLane({ status, bot, elapsed, task, tool, output, usage, className }: AgentLaneProps) {
  return (
    <view
      className={cn(
        "motion-colors flex min-w-0 flex-col gap-1.5 rounded-2xl border bg-bg-surface px-4 py-3",
        status === "failed" ? "border-border-danger" : "border-border-default",
        className,
      )}
    >
      <view className="flex flex-row items-center gap-2">
        {/* live-pulse draws its ring in currentColor, so the running wrapper carries the tile's sky tone. */}
        <view
          className={cn("shrink-0 rounded-[5px]", status === "running" && "text-sky-400")}
          style={
            status === "running"
              ? {
                  animationName: "live-pulse",
                  animationDuration: "2s",
                  animationTimingFunction: EASE_OUT_QUINT,
                  animationIterationCount: "infinite",
                }
              : undefined
          }
        >
          <view
            className={cn(
              "motion-colors flex size-[18px] flex-row items-center justify-center rounded-[5px]",
              botTile[status],
            )}
          >
            <text className="text-label-sm text-text-inverse">{bot.initial}</text>
          </view>
        </view>
        <view className="min-w-0 flex-1">
          {isPlainText(bot.name) ? (
            <text className="truncate text-caption text-text-secondary">{bot.name}</text>
          ) : (
            <view className="min-w-0">{bot.name}</view>
          )}
        </view>
        <view className="flex size-3.5 shrink-0 flex-row items-center justify-center">
          {status === "running" ? <Spinner size={12} /> : null}
          {status === "done" ? <Icon name="CheckCircle" size={14} color="text-secondary" /> : null}
          {status === "failed" ? <Icon name="WarningCircle" size={14} color="text-danger" /> : null}
        </view>
        {elapsed ? (
          isPlainText(elapsed) ? (
            <text className="shrink-0 text-caption tabular-nums text-text-secondary">{elapsed}</text>
          ) : (
            <view className="shrink-0">{elapsed}</view>
          )
        ) : null}
      </view>
      {isPlainText(task) ? (
        <text className="min-w-0 break-all text-label-lg text-text-primary">{task}</text>
      ) : (
        <view className="min-w-0">{task}</view>
      )}
      {tool ? (
        <view className="flex flex-row items-center gap-1.5">
          <view className="flex shrink-0">{tool.icon}</view>
          {isPlainText(tool.label) ? (
            <text className="truncate text-caption text-text-secondary">{tool.label}</text>
          ) : (
            <view className="min-w-0 flex-1">{tool.label}</view>
          )}
        </view>
      ) : null}
      {output ? (
        isPlainText(output) ? (
          <text
            className={cn(
              "min-w-0 break-all text-body-sm",
              status === "failed" ? "text-text-danger" : "text-text-primary",
            )}
          >
            {output}
          </text>
        ) : (
          <view className="min-w-0">{output}</view>
        )
      ) : null}
      {usage ? isPlainText(usage) ? <text className="text-caption text-text-secondary">{usage}</text> : usage : null}
    </view>
  );
}
