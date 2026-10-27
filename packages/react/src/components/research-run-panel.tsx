import { ArrowUp, CaretDown, Check, MagnifyingGlass, Plus, Stop } from "@phosphor-icons/react";
import { type CSSProperties, type ComponentProps, type ReactNode, useRef } from "react";

import { cn } from "../lib/cn";
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
  followUpPlaceholder = "Ask a follow-up",
  onFollowUp,
  className,
  ...props
}: ResearchRunPanelProps) {
  const field = useRef<HTMLInputElement>(null);
  const count = read !== undefined && total !== undefined ? `${read} of ${total} read` : undefined;
  return (
    <section
      className={cn(
        "flex w-full max-w-150 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-5 pt-4 pb-3.5">
        <MagnifyingGlass aria-hidden className="size-4 shrink-0 text-text-primary" />
        <h3 className="min-w-0 flex-1 truncate text-[16px]/[22px] font-medium text-text-primary">{title}</h3>
        <button
          type="button"
          onClick={onNewResearch}
          className="motion-press flex h-7.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-3.5 pl-3 text-[12px]/[16px] font-medium text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          {newLabel}
          <Plus aria-hidden className="size-3.5" />
        </button>
      </header>
      <div role="separator" className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-3 px-5 pt-4.5 pb-4">
        <p className="max-w-[85%] self-end rounded-2xl bg-interactive-primary px-3.5 py-2.5 text-body-sm text-text-inverse">
          {question}
        </p>
        {running && (
          <div className="flex items-center gap-1.5" aria-live="polite">
            <Spinner size={14} />
            <span className="text-[14px]/[20px] font-medium text-text-primary">{statusLabel}</span>
            {(elapsed !== undefined || count !== undefined) && (
              <span className="text-[12px]/[18px] text-text-secondary">
                {elapsed !== undefined && <span>· {elapsed}</span>}
                {count !== undefined && <span> · {count}</span>}
              </span>
            )}
            <CaretDown aria-hidden className="size-3 shrink-0 text-text-secondary" />
            <span aria-hidden className="h-3 w-0.5 shrink-0 animate-caret rounded-[1px] bg-interactive-primary" />
          </div>
        )}
        {queries && queries.length > 0 && (
          <ul className="relative flex flex-col gap-2.5 py-0.5 pl-3.5">
            <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[1.5px] rounded-full bg-overlay-ink-14" />
            {queries.map((query, index) => (
              <li key={query.id} className="motion-rise flex items-center gap-2.5" style={stagger(index)}>
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
                >{query.text}</span>
                {query.results !== undefined && (
                  <span className="shrink-0 text-[12px]/[18px] text-text-secondary">{query.results}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {sources && sources.length > 0 && (
          <div className="flex h-9 w-fit items-center gap-2 rounded-full bg-overlay-ink-5 pr-3 pl-1">
            <span className="flex">
              {sources.map((initial, index) => (
                <span
                  key={initial}
                  className="flex size-6.5 items-center justify-center rounded-full bg-sky-700 text-[11px]/[16px] font-medium text-white ring-2 ring-bg-surface"
                  style={{ marginLeft: index === 0 ? 0 : -8 }}
                >
                  {initial}
                </span>
              ))}
            </span>
            <span className="text-[13px]/[18px] font-medium text-text-primary">
              {read} of {total} sources read
            </span>
            <CaretDown aria-hidden className="size-3 text-text-secondary" />
          </div>
        )}
      </div>
      <form
        className="px-4 pt-1 pb-4"
        onSubmit={(event) => {
          event.preventDefault();
          const input = field.current;
          if (!input) return;
          onFollowUp?.(input.value);
          input.value = "";
        }}
      >
        <div className="motion-colors flex h-11.5 items-center gap-2 rounded-full bg-overlay-ink-5 pr-1.5 pl-4 focus-within:bg-overlay-ink-8">
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
            className="motion-press flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-interactive-primary text-text-inverse focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            {running ? <Stop aria-hidden weight="fill" className="size-3.5" /> : <ArrowUp aria-hidden className="size-4" />}
          </button>
        </div>
      </form>
    </section>
  );
}
