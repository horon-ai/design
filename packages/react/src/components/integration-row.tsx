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
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass row. */
  surface?: "solid" | "glass";
  className?: string;
};

const tileClass: Record<IntegrationStatus, string> = {
  connected: "bg-sky-500 text-neutral-50",
  reconnect: "bg-sky-700 text-neutral-50",
  "not-connected": "bg-bg-subtle text-text-secondary",
};

/** Figma `Integration row` (Integrations 110:883): 40px tile, status pill on the right, solid or thick glass. */
export function IntegrationRow({
  icon,
  name,
  detail,
  status,
  onAction,
  connectedLabel = "Connected",
  reconnectLabel = "Reconnect",
  connectLabel = "Connect",
  surface = "solid",
  className,
}: IntegrationRowProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 overflow-clip rounded-2xl py-3 pr-3.5 pl-3",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        status === "reconnect" &&
          (surface === "glass" ? "[--glass-edge:var(--color-border-danger)]" : "border-border-danger"),
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <span
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center rounded-[10px] motion-colors [&>svg]:size-5",
          surface === "glass" && status === "not-connected"
            ? "bg-overlay-ink-6 text-text-secondary"
            : tileClass[status],
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
      <span className="motion-swap relative shrink-0">
        <span
          data-hidden={status !== "connected" || undefined}
          aria-hidden={status !== "connected" || undefined}
          className="flex h-7.5 items-center justify-center gap-1.5 rounded-full bg-accent-sky-500-18 px-3 text-label-sm whitespace-nowrap text-text-primary"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-status-live" />
          {connectedLabel}
        </span>
        <button
          type="button"
          onClick={onAction}
          data-hidden={status === "connected" || undefined}
          aria-hidden={status === "connected" || undefined}
          tabIndex={status === "connected" ? -1 : undefined}
          className={cn(
            "flex h-7.5 motion-press cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-label-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
            status === "reconnect"
              ? "bg-accent-red-500-14 text-text-danger"
              : "bg-interactive-primary text-text-inverse",
          )}
        >
          {status === "not-connected" && <Plug aria-hidden className="size-3.5" />}
          {status === "reconnect" ? reconnectLabel : connectLabel}
        </button>
      </span>
    </div>
  );
}
