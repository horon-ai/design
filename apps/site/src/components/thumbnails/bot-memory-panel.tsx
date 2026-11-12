import { MagnifyingGlass } from "@phosphor-icons/react";

/* Static facsimile of BotMemoryPanel: the real panel adds two switch rows, the
 * transient toast and a taller list, so the meter, the filter track and the
 * grouped memories are rebuilt here at tile size. */
export default function BotMemoryPanelThumbnail() {
  return (
    <section className="flex w-[340px] flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface">
      <header className="flex items-center gap-2.5 px-4 pt-2 pb-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-label-lg text-text-primary">Memory</span>
          <span className="truncate text-caption text-text-secondary">What Chief of staff remembers</span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-caption text-text-secondary">62% full</span>
          <span className="h-1 w-14 overflow-clip rounded-full bg-overlay-ink-8">
            <span className="block h-full w-[62%] rounded-full bg-interactive-primary" />
          </span>
        </div>
      </header>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex items-center gap-2 px-4 pt-1 pb-0.5">
        <span className="flex w-fit items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px] text-label-md">
          <span className="flex h-6 items-center rounded-full bg-overlay-ink-10 px-2.5 text-text-primary">All</span>
          <span className="flex h-6 items-center rounded-full px-2.5 text-text-secondary">About you</span>
          <span className="flex h-6 items-center rounded-full px-2.5 text-text-secondary">Preferences</span>
        </span>
        <span className="min-w-0 flex-1" />
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-overlay-ink-6 text-text-secondary">
          <MagnifyingGlass aria-hidden className="size-3" />
        </span>
      </div>
      <div className="flex flex-col gap-0.5 px-4 pt-1.5 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-label-sm text-text-secondary">Preferences</span>
          <span className="text-caption text-text-secondary">2</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-full bg-accent-sky-500-10 px-2 py-0">
          <span className="text-body-sm text-text-primary">Wants replies under 120 words</span>
          <span className="text-caption text-text-secondary">From a chat · just now</span>
        </div>
        <div className="flex flex-col gap-0.5 px-2 py-0">
          <span className="text-body-sm text-text-primary">Short answer first, details after</span>
          <span className="text-caption text-text-secondary">Added by you · Oct 12</span>
        </div>
      </div>
    </section>
  );
}
