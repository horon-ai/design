import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

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

/**
 * Figma `Agent lane` (Agent orchestrator 113:953): one sub-agent's card in a fan-out, flat subtle with a red rim on failure.
 *
 * @example
 * ```tsx
 * <AgentLane
 *   status="running"
 *   bot={{ initial: "R", name: "Researcher" }}
 *   task="Gather the Q3 metrics"
 *   tool={{ icon: <span aria-hidden>N</span>, label: "Notion · Q3 metrics dashboard" }}
 *   elapsed="1.9s"
 * />
 * ```
 */
export function AgentLane({ status, bot, elapsed, task, tool, output, usage, className }: AgentLaneProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1.5 rounded-2xl border bg-bg-surface px-4 py-3 motion-colors",
        status === "failed" ? "border-border-danger" : "border-border-default",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-caption text-text-secondary">
        {/* live-pulse draws its ring in currentColor, so the running wrapper carries the tile's sky tone. */}
        <span className={cn("shrink-0 rounded-[5px]", status === "running" && "animate-live-pulse text-sky-400")}>
          <span
            className={cn(
              "flex size-4.5 items-center justify-center rounded-[5px] text-label-sm text-text-inverse motion-colors",
              botTile[status],
            )}
          >
            {bot.initial}
          </span>
        </span>
        <span className="min-w-0 flex-1 truncate">{bot.name}</span>
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          {status === "running" && <Spinner size={12} />}
          {status === "done" && <CheckCircle aria-hidden className="size-3.5" />}
          {status === "failed" && <WarningCircle aria-hidden className="size-3.5 text-text-danger" />}
        </span>
        {elapsed && <span className="shrink-0 tabular-nums">{elapsed}</span>}
      </div>
      <p className="min-w-0 text-label-lg wrap-break-word text-text-primary">{task}</p>
      {tool && (
        <div className="flex items-center gap-1.5 text-caption text-text-secondary [&>svg]:size-3.5">
          {tool.icon}
          <span className="truncate">{tool.label}</span>
        </div>
      )}
      {output && (
        <p
          className={cn(
            "min-w-0 text-body-sm wrap-break-word",
            status === "failed" ? "text-text-danger" : "text-text-primary",
          )}
        >
          {output}
        </p>
      )}
      {usage && <p className="text-caption text-text-secondary">{usage}</p>}
    </div>
  );
}
