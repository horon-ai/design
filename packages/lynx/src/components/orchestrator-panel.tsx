import { Children, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
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
  /** Panel heading, drawn as the panel's own title line. */
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
  /** Closing summary card; nothing is drawn when unset. */
  summary?: OrchestratorSummary;
  /** Extra classes on the panel root, merged after the built-in ones. */
  className?: string;
};

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** React staggered rows with `--i`; Lynx writes the delay as a plain inline duration. */
const stagger = (index: number): CSSProperties => ({ animationDelay: `${index * 30}ms` });

/**
 * Figma `Orchestrator` (Agents N1): a 24px-radius solid panel, header with a parallel picker and Stop, a lead row, its plan, branching lanes and a summary.
 *
 * Renders a lead bot that fans work out to lane cards: the connector draws one
 * elbow per child and a vertical trunk between them, and the plan rows and lane
 * cards rise in with a 30ms stagger. Every part is optional except `title` and
 * `lead`, so the panel works as a bare lead view too.
 *
 * React used `<section>`/`<h3>`/`<ul>`; Lynx has no such elements, so the panel is
 * a `view` with a `summary` accessibility role, the heading is a `<text>`, and the
 * plan and lane lists are plain rows. The connector elbows are drawn with
 * `border-b`/`border-l` on absolutely positioned views, because Lynx has no
 * pseudo-elements. The summary's `motion-reveal` wrapper is dropped: Lynx does not
 * match `data-*` attributes in its stylesheet, so an absent summary simply renders
 * nothing.
 *
 * @example
 * ```tsx
 * import { AgentLane, OrchestratorPanel } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <OrchestratorPanel
 *       title="Orchestrator"
 *       parallelOptions={[1, 2, 3]}
 *       parallelValue={2}
 *       onParallelChange={setParallel}
 *       onStop={stop}
 *       lead={{ initial: "H", name: "Horon", status: "2 working", running: true }}
 *       plan={[{ label: "Collect sources" }, { label: "Draft the summary", running: true }]}
 *       summary={{ count: "0 of 2 returned", body: "Lanes are still running." }}
 *     >
 *       <AgentLane status="running" bot={{ initial: "R", name: "Researcher" }} task="Collect sources" />
 *     </OrchestratorPanel>
 *   );
 * }
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
  const lanes = Children.map(children, (child) => child as ReactNode) ?? [];

  return (
    <view
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      accessibility-element
      accessibility-role-description="summary"
    >
      <view className="flex flex-col gap-3 px-5 pb-3.5 pt-4">
        {isPlainText(title) ? (
          <text className="text-label-lg text-text-primary">{title}</text>
        ) : (
          <view className="flex flex-row items-center">{title}</view>
        )}
        <view className="flex flex-row flex-wrap items-center gap-2.5">
          {isPlainText(parallelLabel) ? (
            <text className="text-body-sm text-text-secondary">{parallelLabel}</text>
          ) : (
            parallelLabel
          )}
          {parallelOptions ? (
            <SegmentedControl
              aria-label={typeof parallelLabel === "string" ? parallelLabel : undefined}
              size="sm"
              surface="inset"
              value={parallelValue === undefined ? undefined : String(parallelValue)}
              onValueChange={(next) => onParallelChange?.(Number(next))}
              items={parallelOptions.map((option) => ({ value: String(option), label: String(option) }))}
            />
          ) : null}
          <view className="min-w-0 flex-1" />
          {onStop ? (
            <view
              className="motion-press flex h-[30px] shrink-0 flex-row items-center justify-center gap-1.5 rounded-full bg-overlay-ink-6 px-3 active:bg-overlay-ink-10"
              bindtap={onStop}
              accessibility-element
              accessibility-traits="button"
            >
              <Icon name="Stop" size={14} color="text-primary" />
              {isPlainText(stopLabel) ? (
                <text className="text-label-sm text-text-primary">{stopLabel}</text>
              ) : (
                stopLabel
              )}
            </view>
          ) : null}
        </view>
      </view>
      <view className="h-px bg-overlay-ink-8" accessibility-role-description="separator" />
      <view className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        <view className="flex flex-row flex-wrap items-center gap-2">
          <view className="flex h-[22px] w-[22px] shrink-0 flex-row items-center justify-center rounded-[5px] bg-interactive-primary">
            <text className="text-trim text-label-sm text-text-inverse">{lead.initial}</text>
          </view>
          {isPlainText(lead.name) ? (
            <text className="min-w-0 truncate text-label-lg text-text-primary">{lead.name}</text>
          ) : (
            <view className="flex min-w-0 flex-row items-center">{lead.name}</view>
          )}
          <view className="flex min-w-0 flex-1 flex-row items-center">
            {isPlainText(lead.role ?? "Lead") ? (
              <text className="min-w-0 truncate text-body-sm text-text-secondary">{lead.role ?? "Lead"}</text>
            ) : (
              (lead.role ?? "Lead")
            )}
          </view>
          {lead.running ? <Spinner size={13} /> : null}
          {lead.status ? (
            isPlainText(lead.status) ? (
              <text className="shrink-0 text-caption text-text-secondary">{lead.status}</text>
            ) : (
              lead.status
            )
          ) : null}
          {lead.elapsed ? (
            isPlainText(lead.elapsed) ? (
              <text className="shrink-0 text-caption text-text-secondary">{lead.elapsed}</text>
            ) : (
              lead.elapsed
            )
          ) : null}
        </view>
        {plan && plan.length > 0 ? (
          <view className="flex flex-col gap-1.5 pb-1 pl-[30px] pt-0.5">
            {plan.map((item, index) => (
              <view
                key={item.label}
                className="motion-rise flex min-w-0 flex-row items-center gap-2.5"
                style={stagger(index)}
              >
                <view
                  className="flex shrink-0 flex-row items-center"
                  style={
                    item.running
                      ? {
                          animationName: "live-pulse",
                          animationDuration: "2s",
                          animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                          animationIterationCount: "infinite",
                        }
                      : undefined
                  }
                  accessibility-elements-hidden
                >
                  <view className={cn("h-1.5 w-1.5 rounded-full", item.dotClassName ?? "bg-status-live")} />
                </view>
                <text className="min-w-0 flex-1 break-all text-body-sm text-text-primary">{item.label}</text>
              </view>
            ))}
          </view>
        ) : null}
        {lanes.length > 0 ? (
          <view className="flex flex-row items-start">
            <view className="flex min-w-0 flex-1 flex-col gap-2.5 pl-[30px]">
              {lanes.map((lane, index) => (
                <view
                  key={isValidElement(lane) && lane.key != null ? lane.key : `lane-${index}`}
                  className="motion-rise relative"
                  style={stagger(index)}
                >
                  <view
                    className="absolute h-[22px] w-[30px] rounded-bl-lg border-b-[1.5px] border-l-[1.5px] border-overlay-ink-14"
                    style={{ top: 0, left: "-30px" }}
                    accessibility-element={false}
                  />
                  {index < lanes.length - 1 ? (
                    <view
                      className="absolute border-l-[1.5px] border-overlay-ink-14"
                      style={{ top: "22px", bottom: "-10px", left: "-30px" }}
                      accessibility-element={false}
                    />
                  ) : null}
                  {lane}
                </view>
              ))}
            </view>
          </view>
        ) : null}
        {summary ? (
          <view className="flex flex-col gap-1 rounded-2xl bg-overlay-ink-4 px-4 py-3" style={stagger(lanes.length)}>
            <view className="flex flex-row items-center gap-2">
              <view className="flex min-w-0 flex-1 flex-row items-center">
                {isPlainText(summary.title ?? "Summary") ? (
                  <text className="min-w-0 text-label-md text-text-primary">{summary.title ?? "Summary"}</text>
                ) : (
                  (summary.title ?? "Summary")
                )}
              </view>
              {summary.count ? (
                isPlainText(summary.count) ? (
                  <text className="shrink-0 text-caption text-text-secondary">{summary.count}</text>
                ) : (
                  summary.count
                )
              ) : null}
            </view>
            {isPlainText(summary.body) ? (
              <text className="text-body-sm text-text-secondary">{summary.body}</text>
            ) : (
              summary.body
            )}
          </view>
        ) : null}
      </view>
    </view>
  );
}
