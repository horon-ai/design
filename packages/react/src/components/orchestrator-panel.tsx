import { Stop } from "@phosphor-icons/react";
import { Children, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

export type OrchestratorLead = {
  /** One letter shown in the 22px ink tile. */
  initial: string;
  name: ReactNode;
  /** Role caption next to the name, such as "Lead". */
  role?: ReactNode;
  /** Status text, such as "1 working". */
  status?: ReactNode;
  /** Shows the 13px spinner while the lead waits on its lanes. */
  running?: boolean;
  elapsed?: ReactNode;
};

export type OrchestratorPlanItem = {
  label: string;
  /** Dot color of the lane that runs this step, such as "bg-sky-600". Defaults to the live blue. */
  dotClassName?: string;
  /** Pulses the dot while the lane works. */
  running?: boolean;
};

export type OrchestratorSummary = {
  title?: ReactNode;
  /** Right-aligned count, such as "1 of 3 returned". */
  count?: ReactNode;
  body: ReactNode;
};

export type OrchestratorPanelProps = {
  title: ReactNode;
  /** Label before the segmented picker, such as "Bots in parallel". */
  parallelLabel?: ReactNode;
  /** Choices of the parallel picker. */
  parallelOptions?: number[];
  parallelValue?: number;
  onParallelChange?: (value: number) => void;
  stopLabel?: ReactNode;
  /** Renders the Stop button when set. */
  onStop?: () => void;
  lead: OrchestratorLead;
  plan?: OrchestratorPlanItem[];
  /** `AgentLane` cards; the branch connector draws one elbow per lane. */
  children?: ReactNode;
  summary?: OrchestratorSummary;
  className?: string;
};

const stagger = (index: number) => ({ "--i": index, animationDelay: `calc(var(--i) * 30ms)` }) as CSSProperties;

/** Figma `Orchestrator` (Agents N1): a 24px-radius solid panel, header with a parallel picker and Stop, a lead row, its plan, branching lanes and a summary. */
export function OrchestratorPanel({
  title,
  parallelLabel = "Bots in parallel",
  parallelOptions,
  parallelValue,
  onParallelChange,
  stopLabel = "Stop",
  onStop,
  lead,
  plan,
  children,
  summary,
  className,
}: OrchestratorPanelProps) {
  const lanes = Children.toArray(children);
  const selected = parallelOptions && parallelValue !== undefined ? parallelOptions.indexOf(parallelValue) : -1;
  return (
    <section
      className={cn(
        "flex w-full flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
    >
      <header className="flex flex-col gap-3 px-5 pt-4.5 pb-4">
        <h3 className="text-label-lg text-text-primary">{title}</h3>
        <div className="flex items-center gap-2.5">
          <span className="text-body-sm text-text-secondary">{parallelLabel}</span>
          {parallelOptions && (
            <div
              role="radiogroup"
              aria-label={typeof parallelLabel === "string" ? parallelLabel : undefined}
              className="relative flex gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]"
            >
              {selected >= 0 && (
                <span
                  aria-hidden
                  className="motion-indicator absolute top-[3px] left-[3px] h-7 w-7.5 rounded-full bg-overlay-ink-10"
                  style={{ translate: `${selected * 32}px 0` }}
                />
              )}
              {parallelOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={option === parallelValue}
                  onClick={() => onParallelChange?.(option)}
                  className={cn(
                    "motion-colors relative flex h-7 w-7.5 cursor-pointer items-center justify-center rounded-full text-label-md focus-visible:outline-2 focus-visible:outline-text-brand",
                    option === parallelValue ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <span className="min-w-0 flex-1" />
          {onStop && (
            <button
              type="button"
              onClick={onStop}
              className="motion-press flex h-7.5 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              <Stop aria-hidden className="size-3.5" />
              {stopLabel}
            </button>
          )}
        </div>
      </header>
      <div role="separator" className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-2.5 px-5 pt-4 pb-5">
        <div className="flex items-center gap-2">
          <span className="flex size-5.5 shrink-0 items-center justify-center rounded-[5px] bg-interactive-primary text-label-sm text-text-inverse">
            {lead.initial}
          </span>
          <span className="text-label-lg text-text-primary">{lead.name}</span>
          <span className="min-w-0 flex-1 truncate text-body-sm text-text-secondary">{lead.role ?? "Lead"}</span>
          {lead.running && <Spinner size={13} />}
          {lead.status && <span className="shrink-0 text-caption text-text-secondary">{lead.status}</span>}
          {lead.elapsed && <span className="shrink-0 text-caption text-text-secondary">{lead.elapsed}</span>}
        </div>
        {plan && plan.length > 0 && (
          <ul className="flex flex-col gap-1.5 pt-0.5 pb-1 pl-7.5">
            {plan.map((item, index) => (
              <li key={item.label} className="motion-rise flex items-center gap-2.5" style={stagger(index)}>
                <span
                  aria-hidden
                  className={cn("shrink-0 rounded-full text-sky-400", item.running && "animate-live-pulse")}
                >
                  <span className={cn("block size-1.5 rounded-full", item.dotClassName ?? "bg-status-live")} />
                </span>
                <span className="text-body-sm text-text-primary">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
        {lanes.length > 0 && (
          <div className="flex items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 pl-7.5">
              {Children.map(lanes, (lane, index) => (
                <div className="motion-rise relative" style={stagger(index)}>
                  <span
                    aria-hidden
                    className="absolute top-0 -left-7.5 h-5.5 w-7.5 rounded-bl-lg border-b-[1.5px] border-l-[1.5px] border-overlay-ink-14"
                  />
                  {index < lanes.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-5.5 -bottom-2.5 -left-7.5 border-l-[1.5px] border-overlay-ink-14"
                    />
                  )}
                  {lane}
                </div>
              ))}
            </div>
          </div>
        )}
        {summary && (
          <div
            className="motion-rise flex flex-col gap-1 rounded-[16px] bg-overlay-ink-4 px-3.5 py-3"
            style={stagger(lanes.length)}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 text-label-md text-text-primary">{summary.title ?? "Summary"}</span>
              {summary.count && <span className="shrink-0 text-caption text-text-secondary">{summary.count}</span>}
            </div>
            <p className="text-body-sm text-text-secondary">{summary.body}</p>
          </div>
        )}
      </div>
    </section>
  );
}
