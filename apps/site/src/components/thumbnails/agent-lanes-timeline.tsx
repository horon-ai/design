import { CaretDown, Envelope, FileText, Folder, Pulse, Warning } from "@phosphor-icons/react";

/* Static facsimile of AgentLanesTimeline: the real panel reserves a 230px label
 * column on a 700px minimum canvas, so the lane rows are rebuilt here at tile
 * size against the same token classes and task tones. */
export default function AgentLanesTimelineThumbnail() {
  return (
    <section className="flex w-[344px] flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface">
      <div className="flex items-center gap-2.5 px-4 pt-2.5 pb-2">
        <Pulse aria-hidden className="size-4 shrink-0 text-text-primary" />
        <span className="text-label-lg text-text-primary">Bots</span>
        <span className="flex items-center gap-1.5 text-caption text-text-secondary">
          <span aria-hidden className="size-1.5 rounded-full bg-status-live" />2 running
        </span>
        <span className="min-w-0 flex-1" />
        <span className="flex h-6 shrink-0 items-center gap-1 rounded-full bg-overlay-ink-6 px-2.5 text-label-sm text-text-primary">
          Last 30m
          <CaretDown aria-hidden className="size-3 text-text-secondary" />
        </span>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col px-4 pt-1 pb-1.5">
        <div className="flex items-center gap-2 pb-0.5">
          <span className="w-[110px] shrink-0" />
          <span className="flex min-w-0 flex-1 items-center justify-between text-caption text-text-secondary tabular-nums">
            <span>30m</span>
            <span>15m</span>
            <span>now</span>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2 border-b border-overlay-ink-6">
          <span className="flex w-[110px] shrink-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[7px] bg-sky-500 text-label-sm text-text-on-ink">
              R
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-label-sm text-text-primary">Researcher</span>
              <span className="truncate text-caption text-text-secondary">Notion</span>
            </span>
          </span>
          <span className="relative min-w-0 flex-1 self-stretch">
            <span className="absolute top-1/2 left-0 flex h-6 w-[42%] -translate-y-1/2 items-center gap-1 overflow-clip rounded-[6px] bg-overlay-ink-6 px-1.5 text-caption text-text-secondary">
              <Folder aria-hidden className="size-2.5 shrink-0" />
              <span className="min-w-0 truncate">Portfolio</span>
            </span>
            <span className="absolute top-1/2 left-[45%] flex h-6 w-[55%] -translate-y-1/2 items-center gap-1 overflow-clip rounded-[6px] bg-status-live/20 px-1.5 text-caption text-text-primary">
              <Envelope aria-hidden className="size-2.5 shrink-0" />
              <span className="min-w-0 truncate">Investor Q&amp;A</span>
            </span>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2 border-b border-overlay-ink-6">
          <span className="flex w-[110px] shrink-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[7px] bg-sky-700 text-label-sm text-text-on-ink">
              W
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-label-sm text-text-primary">Writer</span>
              <span className="truncate text-caption text-text-secondary">Docs</span>
            </span>
          </span>
          <span className="relative min-w-0 flex-1 self-stretch">
            <span className="absolute top-1/2 left-[24%] flex h-6 w-[76%] -translate-y-1/2 items-center gap-1 overflow-clip rounded-[6px] bg-status-live/20 px-1.5 text-caption text-text-primary">
              <FileText aria-hidden className="size-2.5 shrink-0" />
              <span className="min-w-0 truncate">Draft update</span>
            </span>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2">
          <span className="flex w-[110px] shrink-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[7px] bg-interactive-primary text-label-sm text-text-inverse">
              C
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-label-sm text-text-primary">Chief of staff</span>
              <span className="truncate text-caption text-text-secondary">Gmail</span>
            </span>
          </span>
          <span className="relative min-w-0 flex-1 self-stretch">
            <span className="absolute top-1/2 left-[34%] flex h-6 w-[66%] -translate-y-1/2 items-center gap-1 overflow-clip rounded-[6px] border border-interactive-primary bg-bg-surface-90 px-1.5 text-caption text-text-primary">
              <Warning aria-hidden className="size-2.5 shrink-0" />
              <span className="min-w-0 truncate">Needs your yes</span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
