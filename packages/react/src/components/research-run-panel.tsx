import { ArrowUp, CaretDown, Check, MagnifyingGlass, Plus, Stop } from "@phosphor-icons/react";
import { Fragment, type CSSProperties, type ComponentProps, type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
import { ChatBubble } from "./chat-bubble";
import { Spinner } from "./spinner";

export type ResearchQuery = {
  id: string;
  /** `searching` shows a spinner and the muted text; `done` a check. */
  state?: "done" | "searching";
  text: ReactNode;
  /** Result count shown at the end of the row, such as "8 results". */
  results?: ReactNode;
};

export type ResearchRunPanelProps = Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  newLabel?: ReactNode;
  onNewResearch?: () => void;
  /** The question bubble, right-aligned. */
  question: ReactNode;
  /** Shows the spinner, status line and caret while the run works. */
  running?: boolean;
  statusLabel?: ReactNode;
  elapsed?: ReactNode;
  read?: number;
  total?: number;
  queries?: ResearchQuery[];
  /** Initials for the stacked source avatars under the queries. */
  sources?: string[];
  onStop?: () => void;
  /** Makes the sources pill actionable; without it the pill is a plain label. */
  onOpenSources?: () => void;
  /** Makes the running status line expandable; without it the row carries no caret. */
  onToggleStatus?: () => void;
  followUpPlaceholder?: string;
  onFollowUp?: (value: string) => void;
};

const stagger = (index: number) => ({ "--i": index, animationDelay: `calc(var(--i) * 30ms)` }) as CSSProperties;

/** Paper `Research run` (Agents N10): a 24px-radius panel with a header, the question, a live status line and the queries read so far. */
export function ResearchRunPanel({
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
  ...props
}: ResearchRunPanelProps) {
  const field = useRef<HTMLInputElement>(null);
  const count = read !== undefined && total !== undefined ? `${read} of ${total} read` : undefined;
  const meta = [
    { id: "elapsed", value: elapsed },
    { id: "count", value: count },
  ].filter((entry) => entry.value !== undefined);
  const sourcesLabel =
    read !== undefined && total !== undefined ? `${read} of ${total} sources read` : `${sources?.length ?? 0} sources`;
  const avatarStack = (
    <span className="flex shrink-0">
      {sources?.map((initial, index) => (
        <span
          key={initial}
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-label-sm text-text-on-ink ring-2 ring-bg-surface"
          style={{ marginLeft: index === 0 ? 0 : -6 }}
        >
          {initial}
        </span>
      ))}
    </span>
  );
  return (
    <section
      className={cn(
        "flex w-full max-w-150 min-w-0 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-center gap-x-2 gap-y-2 px-5 pt-4 pb-3.5">
        <MagnifyingGlass aria-hidden className="size-4 shrink-0 text-text-primary" />
        <h3 className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</h3>
        <button
          type="button"
          onClick={onNewResearch}
          className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-3 pl-3.5 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          {newLabel}
          <Plus aria-hidden className="size-3.5" />
        </button>
      </header>
      <div role="separator" className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-3 px-5 pt-4 pb-4">
        <ChatBubble from="me" className="max-w-[85%] self-end">
          {question}
        </ChatBubble>
        <div className="motion-reveal" data-collapsed={!running || undefined}>
          <div>
            {onToggleStatus ? (
              <button
                type="button"
                onClick={onToggleStatus}
                aria-live="polite"
                className="flex w-full cursor-pointer flex-wrap items-center gap-x-1.5 gap-y-1 rounded-md text-left focus-visible:outline-2 focus-visible:outline-text-brand"
              >
                <Spinner size={14} />
                <span className="min-w-0 text-label-md text-text-primary">{statusLabel}</span>
                <span aria-hidden className="h-3 w-0.5 shrink-0 animate-caret rounded-[1px] bg-interactive-primary" />
                {meta.length > 0 && (
                  <span className="text-caption text-text-secondary tabular-nums">
                    {meta.map((entry, index) => (
                      <Fragment key={entry.id}>
                        {index > 0 && " · "}
                        {entry.value}
                      </Fragment>
                    ))}
                  </span>
                )}
                <CaretDown aria-hidden className="size-3 shrink-0 text-text-secondary" />
              </button>
            ) : (
              <div aria-live="polite" className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <Spinner size={14} />
                <span className="min-w-0 text-label-md text-text-primary">{statusLabel}</span>
                <span aria-hidden className="h-3 w-0.5 shrink-0 animate-caret rounded-[1px] bg-interactive-primary" />
                {meta.length > 0 && (
                  <span className="text-caption text-text-secondary tabular-nums">
                    {meta.map((entry, index) => (
                      <Fragment key={entry.id}>
                        {index > 0 && " · "}
                        {entry.value}
                      </Fragment>
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {queries && queries.length > 0 && (
          <ul className="relative flex flex-col gap-2.5 py-0.5 pl-3.5">
            <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[1.5px] rounded-full bg-overlay-ink-14" />
            {queries.map((query, index) => (
              <li key={query.id} className="flex motion-rise items-center gap-2.5" style={stagger(index)}>
                {query.state === "searching" ? (
                  <Spinner size={14} />
                ) : (
                  <Check aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
                )}
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-body-sm",
                    query.state === "searching" ? "text-text-secondary" : "text-text-primary",
                  )}
                >
                  {query.text}
                </span>
                {query.results !== undefined && (
                  <span className="shrink-0 text-caption text-text-secondary">{query.results}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {sources && sources.length > 0 && (
          <div className="animate-pop-in">
            {onOpenSources ? (
              <button
                type="button"
                onClick={onOpenSources}
                className="flex h-9 w-fit motion-press cursor-pointer items-center gap-2 rounded-full bg-overlay-ink-5 pr-3 pl-1 hover:bg-overlay-ink-8 focus-visible:outline-2 focus-visible:outline-text-brand"
              >
                {avatarStack}
                <span className="text-label-md text-text-primary tabular-nums">{sourcesLabel}</span>
                <CaretDown aria-hidden className="size-3 text-text-secondary" />
              </button>
            ) : (
              <div className="flex h-9 w-fit items-center gap-2 rounded-full bg-overlay-ink-5 pr-3 pl-1">
                {avatarStack}
                <span className="text-label-md text-text-primary tabular-nums">{sourcesLabel}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <form
        className="px-5 pt-1 pb-4"
        onSubmit={(event) => {
          event.preventDefault();
          const input = field.current;
          if (!input) return;
          onFollowUp?.(input.value);
          input.value = "";
        }}
      >
        <div className="flex h-11 items-center gap-2 rounded-full bg-overlay-ink-5 pr-1.5 pl-4 motion-colors focus-within:bg-overlay-ink-8">
          <input
            ref={field}
            name="follow-up"
            aria-label={followUpPlaceholder}
            placeholder={followUpPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
          <button
            type={running ? "button" : "submit"}
            onClick={running ? onStop : undefined}
            aria-label={running ? "Stop" : "Send"}
            className="flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-interactive-primary text-text-inverse focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <span className="motion-swap size-8 place-items-center">
              <Stop aria-hidden weight="fill" data-hidden={!running || undefined} className="size-3.5" />
              <ArrowUp aria-hidden data-hidden={running || undefined} className="size-4" />
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
