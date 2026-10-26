import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type AgentLaneStatus = "running" | "done" | "failed";

export type AgentLaneProps = {
  status: AgentLaneStatus;
  bot: { initial: string; name: ReactNode };
  /** Duration, such as "1.9s". */
  elapsed?: ReactNode;
  task: ReactNode;
  /** 14px tool icon and source, such as "Notion · Q3 metrics dashboard". */
  tool?: { icon: ReactNode; label: ReactNode };
  /** Latest output, or the error when failed. */
  output?: ReactNode;
  /** Usage caption, such as "2.6k tokens". */
  usage?: ReactNode;
  className?: string;
};

const botTile: Record<AgentLaneStatus, string> = {
  running: "bg-sky-400",
  done: "bg-sky-600",
  failed: "bg-sky-800",
};

/** Figma `Agent lane` (Agent orchestrator 113:953): one sub-agent's card in a fan-out, flat subtle with a red rim on failure. */
export function AgentLane({ status, bot, elapsed, task, tool, output, usage, className }: AgentLaneProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-[16px] bg-bg-subtle px-3.5 py-3",
        status === "failed" && "border border-border-danger",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-caption text-text-secondary">
        <span
          className={cn(
            "flex size-4.5 shrink-0 items-center justify-center rounded-[5px] text-label-sm text-text-inverse",
            botTile[status],
          )}
        >
          {bot.initial}
        </span>
        <span className="min-w-0 flex-1 truncate">{bot.name}</span>
        {status === "running" && <Spinner size={12} />}
        {status === "done" && <CheckCircle aria-hidden className="size-3.5 shrink-0" />}
        {status === "failed" && <WarningCircle aria-hidden className="size-3.5 shrink-0 text-text-danger" />}
        {elapsed && <span className="shrink-0">{elapsed}</span>}
      </div>
      <p className="text-label-lg text-text-primary">{task}</p>
      {tool && (
        <div className="flex items-center gap-1.5 text-caption text-text-secondary [&>svg]:size-3.5">
          {tool.icon}
          <span className="truncate">{tool.label}</span>
        </div>
      )}
      {output && (
        <p className={cn("text-body-sm", status === "failed" ? "text-text-danger" : "text-text-primary")}>{output}</p>
      )}
      {usage && <p className="text-caption text-text-secondary">{usage}</p>}
    </div>
  );
}
