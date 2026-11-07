import { ChatBubble, Spinner } from "@horon-ai/react";
import { CaretDown, Check, MagnifyingGlass, Plus } from "@phosphor-icons/react";

/* Static facsimile of ResearchRunPanel: the real panel adds the follow-up field
 * and a longer query list, so the question, the live status line, the queries
 * read so far and the sources pill are rebuilt here at tile size. */
export default function ResearchRunPanelThumbnail() {
  return (
    <section className="flex w-[340px] flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface">
      <header className="flex items-center gap-2 px-4 pt-2 pb-1.5">
        <MagnifyingGlass aria-hidden className="size-4 shrink-0 text-text-primary" />
        <span className="min-w-0 flex-1 truncate text-label-lg text-text-primary">Research</span>
        <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-2.5 pl-2.5 text-label-sm text-text-primary">
          New research
          <Plus aria-hidden className="size-3" />
        </span>
      </header>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-1 px-4 pt-2 pb-1.5">
        <ChatBubble from="me" size="sm" className="max-w-[88%] self-end">
          Who led AI agent seed rounds?
        </ChatBubble>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <Spinner size={12} label="Researching" />
          <span className="text-label-md text-text-primary">Researching</span>
          <span aria-hidden className="h-3 w-0.5 rounded-[1px] bg-interactive-primary" />
          <span className="text-caption text-text-secondary tabular-nums">12s · 3 of 5 read</span>
        </div>
        <div className="relative flex flex-col gap-1 pl-3">
          <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[1.5px] rounded-full bg-overlay-ink-14" />
          <div className="flex items-center gap-2">
            <Check aria-hidden className="size-3 shrink-0 text-text-secondary" />
            <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">seed rounds AI agents Korea</span>
            <span className="shrink-0 text-caption text-text-secondary">16 results</span>
          </div>
          <div className="flex items-center gap-2">
            <Check aria-hidden className="size-3 shrink-0 text-text-secondary" />
            <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">lead investor agent startup</span>
            <span className="shrink-0 text-caption text-text-secondary">12 results</span>
          </div>
        </div>
        <span className="flex h-7 w-fit items-center gap-2 rounded-full bg-overlay-ink-5 pr-2.5 pl-1.5">
          <span className="flex shrink-0">
            {["T", "P", "M"].map((initial, index) => (
              <span
                key={initial}
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-700 text-caption text-text-on-ink ring-2 ring-bg-surface"
                style={{ marginLeft: index === 0 ? 0 : -5 }}
              >
                {initial}
              </span>
            ))}
          </span>
          <span className="text-label-sm text-text-primary tabular-nums">3 of 5 sources read</span>
          <CaretDown aria-hidden className="size-3 text-text-secondary" />
        </span>
      </div>
    </section>
  );
}
