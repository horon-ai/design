import { useRef, useState, type ReactNode } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";
import { ChatBubble } from "./chat-bubble";
import { Spinner } from "./spinner";

/**
 * One query row in the list under the status line.
 */
export type ResearchQuery = {
  /** Stable key for the row. */
  id: string;
  /**
   * `searching` shows a spinner and the muted text; `done` a check. Anything else (omitted, and
   * any other value) renders as `done`.
   * @default "done"
   */
  state?: "done" | "searching";
  /** The query text, truncated with an ellipsis when the row runs out of width. */
  text: ReactNode;
  /** Result count shown at the end of the row, such as "8 results". */
  results?: ReactNode;
};

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the
 * entry lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `section`; on Lynx every block is a `view`. */
  section: { id?: string; className?: string };
};

/**
 * Props for {@link ResearchRunPanel}. React spread the remaining `section` attributes (`id`, `data-*`,
 * handlers) onto the panel; Lynx has no DOM element to forward them to, so only `id` survives.
 */
export type ResearchRunPanelProps = Omit<PortedElementProps["section"], "className"> & {
  /**
   * Header title next to the magnifying glass.
   * @default "Research"
   */
  title?: ReactNode;
  /**
   * Text of the header button that starts a new run.
   * @default "New research"
   */
  newLabel?: ReactNode;
  /** Fires when the header button is tapped; the button is still rendered without it. */
  onNewResearch?: () => void;
  /** The question bubble, right-aligned. */
  question: ReactNode;
  /**
   * Shows the spinner, status line and caret while the run works; when false the status block is
   * not rendered at all and the submit button becomes a send arrow.
   * @default true
   */
  running?: boolean;
  /**
   * Label in front of the caret in the status line.
   * @default "Researching"
   */
  statusLabel?: ReactNode;
  /** First meta value after the status label, such as "12s"; joins `read`/`total` with a middot. */
  elapsed?: ReactNode;
  /** Pages read so far; with `total` it renders "N of M read" and drives the sources pill label. */
  read?: number;
  /** Pages in the run; must be set together with `read` for the count to appear. */
  total?: number;
  /** Queries resolved so far, drawn under a 1.5px rail with a 30ms stagger per row. */
  queries?: ResearchQuery[];
  /** Initials for the stacked source avatars under the queries. */
  sources?: string[];
  /** Fires from the round button while `running`, which then shows a stop glyph instead of an arrow. */
  onStop?: () => void;
  /** Makes the sources pill actionable; without it the pill is a plain label. */
  onOpenSources?: () => void;
  /** Makes the running status line expandable; without it the row carries no caret. */
  onToggleStatus?: () => void;
  /**
   * Placeholder and accessible name of the follow-up input.
   * @default "Ask a follow-up"
   */
  followUpPlaceholder?: string;
  /** Fires with the raw input value on submit; the field is cleared afterwards. */
  onFollowUp?: (value: string) => void;
  /** Extra classes merged onto the panel. */
  className?: string;
};

/** The Figma spring (`--ease-spring`), written out because an inline animation cannot read a variable. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/** Lynx's engine paints the placeholder from this variable, which the class list sets on the field. */
const PLACEHOLDER_CLASS = "[-x-placeholder-color:var(--color-text-secondary)]";

/** The only part of a Lynx text event the panel reads. */
type LynxTextEvent = { detail: { value: string } };

/**
 * Paper `Research run` (Agents N10): a 24px-radius panel with a header, the question, a live status line and the queries read so far.
 *
 * The panel is presentational: it holds no run state of its own. Submitted follow-ups are handed to
 * `onFollowUp` and the field is cleared, so the caller appends the new question. React folded the
 * status block away with `motion-reveal` on `data-collapsed`; Lynx's stylesheet does not match
 * `data-*` attributes, so the block is rendered only while `running`. The send/stop glyph uses the
 * same trick: React stacked both icons inside `motion-swap`, here only the active one is mounted.
 * The 2px surface ring around the source avatars is a box shadow from the theme, because the v3
 * preset behind Lynx has no `ring-*` utilities.
 *
 * @example
 * ```tsx
 * import { ResearchRunPanel } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <ResearchRunPanel
 *       question="What changed in the EU AI Act this year?"
 *       statusLabel="Reading sources"
 *       read={4}
 *       total={12}
 *       queries={[
 *         { id: "1", text: "EU AI Act amendments", results: "8 results" },
 *         { id: "2", text: "Enforcement timeline", state: "searching" },
 *       ]}
 *       sources={["EU", "CE"]}
 *       onStop={() => {}}
 *       onFollowUp={(value) => console.log(value)}
 *     />
 *   );
 * }
 * ```
 */
export function ResearchRunPanel({
  id,
  title = "Research",
  newLabel = "New research",
  onNewResearch,
  question,
  running = true,
  statusLabel = "Researching",
  elapsed,
  read,
  total,
  queries,
  sources,
  onStop,
  onOpenSources,
  onToggleStatus,
  followUpPlaceholder = "Ask a follow-up",
  onFollowUp,
  className,
}: ResearchRunPanelProps) {
  const theme = useHoronTheme();
  const field = useRef<NodesRef | null>(null);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

  /** Empties the native editor; the render-test element has no native method to call. */
  const clearNative = () => {
    const element = field.current;
    if (!element) return;
    try {
      element.invoke({ method: "setValue", params: { value: "" } }).exec();
    } catch {
      // Nothing to write in a test host; the component's own state is the observable.
    }
  };

  const submit = () => {
    onFollowUp?.(draft);
    setDraft("");
    clearNative();
  };

  const count = read !== undefined && total !== undefined ? `${read} of ${total} read` : undefined;
  const meta = [
    { id: "elapsed", value: elapsed },
    { id: "count", value: count },
  ].filter((entry) => entry.value !== undefined);
  const sourcesLabel =
    read !== undefined && total !== undefined ? `${read} of ${total} sources read` : `${sources?.length ?? 0} sources`;

  const avatarStack = (
    <view className="flex shrink-0 flex-row">
      {sources?.map((initial, index) => (
        <view
          key={initial}
          className="flex size-7 shrink-0 flex-row items-center justify-center rounded-full bg-sky-700"
          style={{
            ...(index === 0 ? {} : { marginLeft: "-6px" }),
            boxShadow: `0 0 0 2px ${theme.color("bg-surface")}`,
          }}
        >
          <text className="text-label-sm text-text-on-ink">{initial}</text>
        </view>
      ))}
    </view>
  );

  const statusRow = (
    <>
      <Spinner size={14} />
      <text className="min-w-0 text-label-md text-text-primary">{statusLabel}</text>
      <view
        className="h-3 w-0.5 shrink-0 rounded-[1px] bg-interactive-primary"
        style={{
          animationName: "caret-blink",
          animationDuration: "1s",
          animationTimingFunction: "step-end",
          animationIterationCount: "infinite",
        }}
      />
      {meta.length > 0 ? (
        <text className="text-caption tabular-nums text-text-secondary">
          {meta.map((entry, index) => (
            <text key={entry.id} className="text-caption tabular-nums text-text-secondary">
              {index > 0 ? " · " : ""}
              {entry.value}
            </text>
          ))}
        </text>
      ) : null}
    </>
  );

  return (
    <view
      className={cn(
        "flex w-full min-w-0 max-w-[600px] flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex flex-row flex-wrap items-center gap-x-2 gap-y-2 px-5 pb-3.5 pt-4">
        <Icon name="MagnifyingGlass" size={16} color="text-primary" className="shrink-0" />
        <text className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</text>
        <view
          className="motion-press flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 pl-3.5 pr-3 active:bg-overlay-ink-10"
          bindtap={() => onNewResearch?.()}
          accessibility-element
          accessibility-traits="button"
        >
          <text className="text-label-sm text-text-primary">{newLabel}</text>
          <Icon name="Plus" size={14} />
        </view>
      </view>
      <view className="h-px bg-overlay-ink-8" accessibility-element={false} />
      <view className="flex flex-col gap-3 px-5 pb-4 pt-4">
        <ChatBubble from="me" className="max-w-[85%] self-end">
          {question}
        </ChatBubble>
        {running ? (
          onToggleStatus ? (
            <view
              className="flex w-full flex-row flex-wrap items-center gap-x-1.5 gap-y-1 rounded-md"
              bindtap={() => onToggleStatus()}
              accessibility-element
              accessibility-traits="button"
              accessibility-role-description="status"
            >
              {statusRow}
              <Icon name="CaretDown" size={12} color="text-secondary" className="shrink-0" />
            </view>
          ) : (
            <view
              className="flex flex-row flex-wrap items-center gap-x-1.5 gap-y-1"
              accessibility-element
              accessibility-role-description="status"
            >
              {statusRow}
            </view>
          )
        ) : null}
        {queries && queries.length > 0 ? (
          <view className="relative flex flex-col gap-2.5 py-0.5 pl-3.5">
            <view
              className="absolute bottom-0 left-0 top-0 w-[1.5px] rounded-full bg-overlay-ink-14"
              accessibility-element={false}
            />
            {queries.map((query, index) => (
              <view
                key={query.id}
                className="motion-rise flex flex-row items-center gap-2.5"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {query.state === "searching" ? (
                  <Spinner size={14} />
                ) : (
                  <Icon name="Check" size={14} color="text-secondary" className="shrink-0" />
                )}
                <text
                  className={cn(
                    "min-w-0 flex-1 truncate text-body-sm",
                    query.state === "searching" ? "text-text-secondary" : "text-text-primary",
                  )}
                >
                  {query.text}
                </text>
                {query.results !== undefined ? (
                  <text className="shrink-0 text-caption text-text-secondary">{query.results}</text>
                ) : null}
              </view>
            ))}
          </view>
        ) : null}
        {sources && sources.length > 0 ? (
          <view
            style={{
              animationName: "pop-in",
              animationDuration: "220ms",
              animationTimingFunction: EASE_SPRING,
              animationFillMode: "both",
            }}
            className="flex flex-row"
          >
            {onOpenSources ? (
              <view
                className="motion-press flex h-9 w-fit flex-row items-center gap-2 rounded-full bg-overlay-ink-5 pl-1 pr-3 active:bg-overlay-ink-8"
                bindtap={() => onOpenSources()}
                accessibility-element
                accessibility-traits="button"
              >
                {avatarStack}
                <text className="text-label-md tabular-nums text-text-primary">{sourcesLabel}</text>
                <Icon name="CaretDown" size={12} color="text-secondary" />
              </view>
            ) : (
              <view className="flex h-9 w-fit flex-row items-center gap-2 rounded-full bg-overlay-ink-5 pl-1 pr-3">
                {avatarStack}
                <text className="text-label-md tabular-nums text-text-primary">{sourcesLabel}</text>
              </view>
            )}
          </view>
        ) : null}
      </view>
      <view className="px-5 pb-4 pt-1">
        <view
          className={cn(
            "motion-colors flex h-11 flex-row items-center gap-2 rounded-full pl-4 pr-1.5",
            focused ? "bg-overlay-ink-8" : "bg-overlay-ink-5",
          )}
        >
          <input
            ref={field}
            className={cn("min-w-0 flex-1 text-body-sm text-text-primary", PLACEHOLDER_CLASS)}
            name="follow-up"
            placeholder={followUpPlaceholder}
            accessibility-element
            accessibility-label={followUpPlaceholder}
            bindinput={(event: LynxTextEvent) => setDraft(event.detail.value)}
            bindfocus={() => setFocused(true)}
            bindblur={() => setFocused(false)}
            bindconfirm={() => {
              if (!running) submit();
            }}
          />
          <view
            className="motion-press flex size-8 shrink-0 flex-row items-center justify-center rounded-full bg-interactive-primary active:bg-interactive-primary-hover"
            bindtap={() => {
              if (running) onStop?.();
              else submit();
            }}
            accessibility-element
            accessibility-traits="button"
            accessibility-label={running ? "Stop" : "Send"}
          >
            {running ? (
              <Icon name="Stop" size={14} weight="fill" color="text-inverse" />
            ) : (
              <Icon name="ArrowUp" size={16} color="text-inverse" />
            )}
          </view>
        </view>
      </view>
    </view>
  );
}
