import { Stop } from "@phosphor-icons/react";
import { Children, isValidElement, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { SegmentedControl } from "./segmented-control";
import { Spinner } from "./spinner";

/** The lead bot row at the top of {@link OrchestratorPanel}. */
export type OrchestratorLead = {
  /** One letter shown in the 22px ink tile. */
  initial: string;
  /** Bot name, next to the tile. */
  name: ReactNode;
  /** Role caption next to the name, such as "Lead". Defaults to "Lead" when unset.
   * @default "Lead" */
  role?: ReactNode;
  /** Status text, such as "1 working". */
  status?: ReactNode;
  /** Shows the 13px spinner while the lead waits on its lanes. */
  running?: boolean;
  /** Timing label at the right, in caption colour. */
  elapsed?: ReactNode;
};

/** One step of the lead's plan, listed under its row. */
export type OrchestratorPlanItem = {
  /** Step text; also the React key, so keep steps unique. */
  label: string;
  /** Dot color of the lane that runs this step, such as "bg-sky-600". Defaults to the live blue. */
  dotClassName?: string;
  /** Pulses the dot while the lane works. */
  running?: boolean;
};

/** The closing summary card of {@link OrchestratorPanel}. */
export type OrchestratorSummary = {
  /** Title of the card.
   * @default "Summary" */
  title?: ReactNode;
  /** Right-aligned count, such as "1 of 3 returned". */
  count?: ReactNode;
  /** Body text of the summary. */
  body: ReactNode;
};

/** Props for {@link OrchestratorPanel}: the header controls, the lead and its plan, the lanes and the summary. */
export type OrchestratorPanelProps = {
  /** Panel heading, rendered as the `h3`. */
  title: ReactNode;
  /** Label before the segmented picker, such as "Bots in parallel". @default "Bots in parallel" */
  parallelLabel?: ReactNode;
  /** Choices of the parallel picker. The picker only renders when this is set. */
  parallelOptions?: number[];
  /** Controlled picked value; the picker is uncontrolled-looking when unset. */
  parallelValue?: number;
  /** Fires with the picked number, converted from the segmented control's string value. */
  onParallelChange?: (value: number) => void;
  /** Text of the Stop button.
   * @default "Stop" */
  stopLabel?: ReactNode;
  /** Renders the Stop button when set. */
  onStop?: () => void;
  /** The lead row: tile, name, role, status and elapsed. */
  lead: OrchestratorLead;
  /** Steps under the lead; each row rises in with a 30ms stagger. Hides the list when empty. */
  plan?: OrchestratorPlanItem[];
  /** `AgentLane` cards; the branch connector draws one elbow per lane. */
  children?: ReactNode;
  /** Closing summary card; the reveal wrapper collapses when unset. */
  summary?: OrchestratorSummary;
  /** Extra classes on the panel `section`, merged after the built-in ones. */
  className?: string;
};

const stagger = (index: number) => ({ "--i": index, animationDelay: `calc(var(--i) * 30ms)` }) as CSSProperties;

/**
 * Figma `Orchestrator` (Agents N1): a 24px-radius solid panel, header with a parallel picker and Stop, a lead row, its plan, branching lanes and a summary.
 *
 * Renders a lead bot that fans work out to lane cards: the connector draws one
 * elbow per child and a vertical trunk between them, and the plan rows and lane
 * cards rise in with a 30ms stagger. The summary does not rise; it is revealed by
 * the `motion-reveal` wrapper around it. Every part is optional except `title` and
 * `lead`, so the panel works as a bare lead view too.
 *
 * @example
 * ```tsx
 * <OrchestratorPanel
 *   title="Orchestrator"
 *   parallelOptions={[1, 2, 3]}
 *   parallelValue={2}
 *   onParallelChange={setParallel}
 *   onStop={stop}
 *   lead={{ initial: "H", name: "Horon", status: "2 working", running: true }}
 *   plan={[{ label: "Collect sources" }, { label: "Draft the summary", running: true }]}
 *   summary={{ count: "0 of 2 returned", body: "Lanes are still running." }}
 * >
 *   <AgentLane status="running" bot={{ initial: "R", name: "Researcher" }} task="Collect sources" />
 * </OrchestratorPanel>
 * ```
 */
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
  return (
    <section
      className={cn(
        "flex w-full min-w-0 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
    >
      <header className="flex flex-col gap-3 px-5 pt-4 pb-3.5">
        <h3 className="text-label-lg text-text-primary">{title}</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-body-sm text-text-secondary">{parallelLabel}</span>
          {parallelOptions && (
            <SegmentedControl
              aria-label={typeof parallelLabel === "string" ? parallelLabel : undefined}
              size="sm"
              surface="inset"
              value={parallelValue === undefined ? undefined : String(parallelValue)}
              onValueChange={(next) => onParallelChange?.(Number(next))}
              items={parallelOptions.map((option) => ({ value: String(option), label: String(option) }))}
            />
          )}
          <span className="min-w-0 flex-1" />
          {onStop && (
            <button
              type="button"
              onClick={onStop}
              className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center justify-center gap-1.5 rounded-full bg-overlay-ink-6 px-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              <Stop aria-hidden className="size-3.5" />
              {stopLabel}
            </button>
          )}
        </div>
      </header>
      <div role="separator" className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-2.5 px-5 pt-4 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex size-5.5 shrink-0 items-center justify-center rounded-xs bg-interactive-primary text-label-sm text-text-inverse">
            {lead.initial}
          </span>
          <span className="min-w-0 truncate text-label-lg text-text-primary">{lead.name}</span>
          <span className="min-w-0 flex-1 truncate text-body-sm text-text-secondary">{lead.role ?? "Lead"}</span>
          {lead.running && <Spinner size={13} />}
          {lead.status && <span className="shrink-0 text-caption text-text-secondary">{lead.status}</span>}
          {lead.elapsed && <span className="shrink-0 text-caption text-text-secondary">{lead.elapsed}</span>}
        </div>
        {plan && plan.length > 0 && (
          <ul className="flex flex-col gap-1.5 pt-0.5 pb-1 pl-7.5">
            {plan.map((item, index) => (
              <li key={item.label} className="flex min-w-0 motion-rise items-center gap-2.5" style={stagger(index)}>
                <span
                  aria-hidden
                  className={cn("shrink-0 rounded-full text-sky-400", item.running && "animate-live-pulse")}
                >
                  <span className={cn("block size-1.5 rounded-full", item.dotClassName ?? "bg-status-live")} />
                </span>
                <span className="min-w-0 text-body-sm wrap-break-word text-text-primary">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
        {lanes.length > 0 && (
          <div className="flex items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 pl-7.5">
              {lanes.map((lane, index) => (
                <div
                  key={isValidElement(lane) && lane.key != null ? lane.key : `lane-${index}`}
                  className="relative motion-rise"
                  style={stagger(index)}
                >
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
        <div className="motion-reveal" data-collapsed={!summary || undefined}>
          <div>
            {summary && (
              <div className="flex flex-col gap-1 rounded-2xl bg-overlay-ink-4 px-4 py-3" style={stagger(lanes.length)}>
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 text-label-md text-text-primary">{summary.title ?? "Summary"}</span>
                  {summary.count && <span className="shrink-0 text-caption text-text-secondary">{summary.count}</span>}
                </div>
                <p className="text-body-sm text-text-secondary">{summary.body}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
