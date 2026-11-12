import { Spinner } from "@horon-ai/react";
import { ArrowUp, Check, Path, Pause } from "@phosphor-icons/react";

/* Static facsimile of AgentSteeringPanel: the real panel stacks a header, a
 * step rail, queued notes, a steer box and a shortcut legend, so it is rebuilt
 * here at tile size with two steps and the steer box. */
export default function AgentSteeringPanelThumbnail() {
  return (
    <section className="flex w-[340px] flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface">
      <div className="flex items-center gap-2.5 px-4 pt-2.5 pb-2">
        <Path aria-hidden className="size-4 shrink-0 text-text-primary" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="truncate text-label-lg text-text-primary">Triage overnight email</div>
          <p className="truncate text-caption text-text-secondary">Chief of staff · Step 2 of 5</p>
        </div>
        <span aria-hidden className="size-1.5 shrink-0 animate-live-pulse rounded-full bg-status-live" />
        <span className="shrink-0 text-body-sm text-text-secondary tabular-nums">2m 10s</span>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-overlay-ink-6 text-text-primary">
          <Pause aria-hidden weight="fill" className="size-3.5" />
        </span>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="relative flex flex-col gap-1.5 px-4 py-2">
        <span
          aria-hidden
          className="absolute top-[22px] bottom-[18px] left-[26px] w-px bg-status-live"
        />
        <div className="relative flex items-center gap-2.5">
          <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-status-live text-text-on-ink">
            <Check aria-label="Done" weight="bold" className="size-2.5" />
          </span>
          <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">Read 41 new emails</span>
          <span className="shrink-0 text-caption text-text-secondary tabular-nums">1.4s</span>
        </div>
        <div className="relative flex items-center gap-2.5">
          <span className="flex size-4.5 shrink-0 items-center justify-center">
            <Spinner size={18} label="Running" />
          </span>
          <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">Sort the 6 that need you</span>
          <span className="shrink-0 text-caption text-text-secondary tabular-nums">4.5s</span>
        </div>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col gap-2 px-4 py-2 pb-2.5">
        <div className="flex h-9 items-center gap-2 rounded-full bg-overlay-ink-5 pr-1.5 pl-3.5">
          <span className="min-w-0 flex-1 truncate text-body-sm text-text-placeholder">Steer the bot…</span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-interactive-primary text-text-inverse">
            <ArrowUp aria-hidden className="size-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
}
