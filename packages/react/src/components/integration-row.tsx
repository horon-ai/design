import { Plug } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type IntegrationStatus = "connected" | "reconnect" | "not-connected";

export type IntegrationRowProps = {
  /** 20px icon shown in inverse on the 40px tile. */
  icon: ReactNode;
  name: ReactNode;
  /** Account and scopes, or the reason a reconnect is needed. */
  detail?: ReactNode;
  status: IntegrationStatus;
  onAction?: () => void;
  connectedLabel?: string;
  reconnectLabel?: string;
  connectLabel?: string;
  className?: string;
};

const tileClass: Record<IntegrationStatus, string> = {
  connected: "bg-sky-500",
  reconnect: "bg-sky-700",
  "not-connected": "bg-interactive-primary",
};

/** Figma `Integration row` (Integrations 110:883): thick glass, 40px tile, status pill on the right. */
export function IntegrationRow({
  icon,
  name,
  detail,
  status,
  onAction,
  connectedLabel = "Connected",
  reconnectLabel = "Reconnect",
  connectLabel = "Connect",
  className,
}: IntegrationRowProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 overflow-clip rounded-[16px] border bg-glass-thick py-3 pr-3.5 pl-3",
        status === "reconnect" ? "border-border-danger" : "border-glass-rim-strong",
        className,
      )}
    >
      <LiquidGlass tier="thick" />
      <span
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center rounded-[10px] text-text-inverse [&>svg]:size-5",
          tileClass[status],
        )}
      >
        {icon}
      </span>
      <span className="relative flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        {detail && (
          <span
            className={cn("truncate text-caption", status === "reconnect" ? "text-text-danger" : "text-text-secondary")}
          >
            {detail}
          </span>
        )}
      </span>
      {status === "connected" ? (
        <span className="relative flex h-7.5 shrink-0 items-center gap-1.5 rounded-full bg-accent-sky-500-18 px-3 text-label-sm text-text-primary">
          <span aria-hidden className="size-1.5 rounded-full bg-status-live" />
          {connectedLabel}
        </span>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            "relative flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full px-3 text-label-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
            status === "reconnect"
              ? "bg-accent-red-500-14 text-text-danger"
              : "bg-interactive-primary text-text-inverse",
          )}
        >
          {status === "not-connected" && <Plug aria-hidden className="size-3.5" />}
          {status === "reconnect" ? reconnectLabel : connectLabel}
        </button>
      )}
    </div>
  );
}
