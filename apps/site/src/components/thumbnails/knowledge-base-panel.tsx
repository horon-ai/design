import { CaretDown, Check, FileText, Globe, Plus, SlidersHorizontal } from "@phosphor-icons/react";

/* Static facsimile of KnowledgeBasePanel: the real panel is 800px wide and its
 * rows carry a four-stage pipeline column, so the header, the pill tabs and two
 * flat source rows are rebuilt here at tile size with the panel's own tokens. */
export default function KnowledgeBasePanelThumbnail() {
  return (
    <section className="flex w-[340px] flex-col gap-1.5 rounded-[24px] border border-border-default bg-bg-surface px-4 pt-2.5 pb-1.5">
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-label-lg text-text-primary">Knowledge base</span>
          <span className="truncate text-caption text-text-secondary">3 sources · 286 chunks</span>
        </div>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-overlay-ink-6 text-text-primary">
          <SlidersHorizontal aria-hidden className="size-3.5" />
        </span>
        <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-2.5 pl-2.5 text-label-sm text-text-primary">
          <Plus aria-hidden className="size-3.5" />
          Add source
          <CaretDown aria-hidden className="size-3 text-text-secondary" />
        </span>
      </div>
      <div className="flex w-fit items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px] text-label-md">
        <span className="flex h-6 items-center gap-1.5 rounded-full bg-overlay-ink-10 px-2.5 text-text-primary">
          Sources
          <span className="text-caption text-text-secondary">3</span>
        </span>
        <span className="flex h-6 items-center rounded-full px-2.5 text-text-secondary">Test retrieval</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 border-b border-overlay-ink-8 px-1 py-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-overlay-ink-5 text-text-primary">
            <FileText aria-hidden className="size-4" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-label-md text-text-primary">Refund policy.pdf</span>
            <span className="truncate text-caption text-text-secondary">12 pages · 45 chunks</span>
          </span>
          <Check aria-label="Ready" className="size-4 shrink-0 text-text-secondary" />
        </div>
        <div className="flex items-center gap-2.5 px-1 py-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-overlay-ink-5 text-text-primary">
            <Globe aria-hidden className="size-4" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-label-md text-text-primary">help.horon.ai</span>
            <span className="truncate text-caption text-text-secondary">Embedding · 140 of 296</span>
          </span>
          <span className="shrink-0 text-label-md text-text-secondary tabular-nums">62%</span>
        </div>
      </div>
    </section>
  );
}
