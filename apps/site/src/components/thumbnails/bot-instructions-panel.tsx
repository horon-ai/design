import { Play } from "@phosphor-icons/react";

/* Static facsimile of BotInstructionsPanel: the real panel is 620px wide with
 * variable inputs, a scenario picker and a run output, so the header, the
 * prompt with `{{variable}}` chips and the tab pair are rebuilt at tile size. */
export default function BotInstructionsPanelThumbnail() {
  return (
    <section className="flex w-[340px] flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface">
      <header className="flex items-center gap-2 px-4 pt-2 pb-1.5">
        <span className="text-label-lg text-text-primary">Morning brief</span>
        <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-6 px-2.5 text-label-sm text-text-primary">
          v4
          <span aria-hidden className="size-1.5 rounded-full bg-status-live" />
          <span className="text-text-secondary">Live</span>
        </span>
        <span className="min-w-0 flex-1" />
        <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-5 pr-2 pl-1 text-label-sm text-text-primary">
          <span className="flex size-4 items-center justify-center rounded-xs bg-interactive-primary text-label-sm text-text-inverse">
            C
          </span>
          Chief of staff
        </span>
      </header>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-1 px-4 pt-1 pb-1.5">
        <div className="flex items-center gap-2">
          <span className="flex w-fit items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px] text-label-md">
            <span className="flex h-6 items-center rounded-full bg-overlay-ink-10 px-2.5 text-text-primary">
              Instructions
            </span>
            <span className="flex h-6 items-center rounded-full px-2.5 text-text-secondary">Example</span>
          </span>
          <span className="min-w-0 flex-1" />
          <span className="shrink-0 text-caption text-text-secondary">112 tokens</span>
        </div>
        <div className="flex flex-col gap-0.5 text-body-sm text-text-primary">
          <p className="flex flex-wrap items-center gap-1">
            <span>Brief for</span>
            <span className="rounded-xs bg-accent-sky-500-18 px-1.5 py-px ring-1 ring-accent-sky-500-90/40 ring-inset">
              user_name
            </span>
            <span>by 8 AM.</span>
          </p>
          <p>Lead with what needs a yes today.</p>
          <p className="flex flex-wrap items-center gap-1">
            <span>- Use</span>
            <span className="rounded-xs bg-accent-sky-700-18 px-1.5 py-px ring-1 ring-accent-sky-700-90/40 ring-inset">
              calendar
            </span>
            <span>for today’s meetings.</span>
          </p>
        </div>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="flex h-6 w-fit items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px] text-label-sm">
          <span className="flex h-5 items-center rounded-full bg-overlay-ink-10 px-2 text-text-primary">
            Busy Monday
          </span>
          <span className="flex h-5 items-center rounded-full px-2 text-text-secondary">Quiet day</span>
        </span>
        <span className="min-w-0 flex-1" />
        <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-interactive-primary pr-2.5 pl-2.5 text-label-sm text-text-inverse">
          <Play aria-hidden weight="fill" className="size-2.5" />
          Run
        </span>
      </div>
    </section>
  );
}
