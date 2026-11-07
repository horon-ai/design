import { ExtractHighlight } from "@horon-ai/react";
import { CaretDown, FilePdf, Minus, Plus } from "@phosphor-icons/react";

/* Static facsimile of DocumentExtractPanel: the real panel pairs a 480px-tall
 * sheet viewer with the extracted field list, so the sheet preview, three field
 * rows and the accept footer are rebuilt here at tile size. */
export default function DocumentExtractPanelThumbnail() {
  return (
    <section className="flex w-[344px] flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface">
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-[8px] bg-overlay-ink-5 text-text-danger">
          <FilePdf aria-hidden className="size-3.5" />
        </span>
        <span className="flex min-w-0 items-center gap-1">
          <span className="min-w-0 truncate text-label-md text-text-primary">invoice-2043.pdf</span>
          <CaretDown aria-hidden className="size-3 shrink-0 text-text-secondary" />
        </span>
        <span className="min-w-0 flex-1" />
        <span className="shrink-0 text-caption text-text-secondary">1 / 1</span>
        <span className="flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[2px] text-label-sm text-text-primary tabular-nums">
          <span className="flex size-5 items-center justify-center rounded-full">
            <Minus aria-hidden className="size-3" />
          </span>
          70%
          <span className="flex size-5 items-center justify-center rounded-full">
            <Plus aria-hidden className="size-3" />
          </span>
        </span>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex gap-3 px-4 py-2">
        <div className="flex w-[134px] shrink-0 flex-col gap-1 bg-neutral-50 p-2 text-neutral-900 ring-1 ring-overlay-ink-8">
          <ExtractHighlight>
            <span className="text-label-sm whitespace-nowrap">larkspur studio</span>
          </ExtractHighlight>
          <div className="h-px bg-neutral-900/10" />
          <ExtractHighlight tone="brand" className="gap-0.5">
            <span className="flex justify-between gap-1 text-caption">
              <span>Sprint</span>
              <span className="tabular-nums">4,820</span>
            </span>
            <span className="flex justify-between gap-1 text-caption">
              <span>Hosting</span>
              <span className="tabular-nums">120</span>
            </span>
          </ExtractHighlight>
          <div className="flex justify-between text-label-sm">
            <span>Total</span>
            <span className="tabular-nums">$4,940</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-[54px] shrink-0 truncate text-caption text-text-secondary">Vendor</span>
            <span className="flex h-6.5 min-w-0 flex-1 items-center rounded-[8px] bg-overlay-ink-4 px-2 text-caption text-text-primary">
              <span className="truncate">Larkspur Studio</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-[54px] shrink-0 truncate text-caption text-text-secondary">Total</span>
            <span className="flex h-6.5 min-w-0 flex-1 items-center rounded-[8px] bg-overlay-ink-4 px-2 text-caption text-text-primary">
              <span className="truncate">$4,940.00</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-[54px] shrink-0 truncate text-caption text-text-secondary">Due date</span>
            <span className="flex h-6.5 min-w-0 flex-1 items-center gap-1 rounded-[8px] bg-overlay-ink-12 px-2 ring-1 ring-border-danger">
              <span className="min-w-0 flex-1 truncate text-caption text-text-primary">Nov 30</span>
              <span className="shrink-0 text-caption text-text-danger">Check</span>
            </span>
          </div>
        </div>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-sky-500" />
          <span className="size-1.5 rounded-full bg-sky-500" />
          <span className="size-1.5 rounded-full bg-sky-500" />
          <span className="size-1.5 rounded-full bg-red-500" />
        </span>
        <span className="text-caption text-text-secondary">4 of 5 filled · 1 to check</span>
        <span className="min-w-0 flex-1" />
        <span className="flex h-6 shrink-0 items-center rounded-full bg-interactive-primary px-2.5 text-label-sm text-text-inverse">
          Accept all
        </span>
      </div>
    </section>
  );
}
