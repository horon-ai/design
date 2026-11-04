import { CaretDown, Plus, SlidersHorizontal, UploadSimple } from "@phosphor-icons/react";
import { type ComponentProps, type DragEvent, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { PanelPillTabs } from "./bot-instructions-panel";
import { Spinner } from "./spinner";

export type KnowledgeBaseTab = {
  id: string;
  label: ReactNode;
  count?: number;
};

export type KnowledgeBasePanelProps = Omit<ComponentProps<"section">, "className" | "title" | "onChange"> & {
  title: ReactNode;
  /** The 12/18 line under the title: sources, chunks, bots. */
  meta?: ReactNode;
  tabs: KnowledgeBaseTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Shows the spinner and "N indexing" at the right of the tabs when above zero. */
  indexing?: number;
  onSettings?: () => void;
  onAddSource?: () => void;
  /** Called with the files dropped on the dropzone or picked with Browse. Omit to hide the dropzone. */
  onFiles?: (files: File[]) => void;
  dropTitle?: ReactNode;
  dropHint?: ReactNode;
  /** Pipeline column labels shown above the list; hidden on narrow widths. */
  stages?: string[];
  /** The list rows, usually `SourceRow variant="list"`. */
  children?: ReactNode;
  className?: string;
};

const defaultStages = ["Parse", "Chunk", "Embed", "Index"];

/**
 * Paper `Knowledge base` (XVM-1): a 24px-radius surface panel with a header, a pill tab tray, a table head, a
 * flat divided source list and a dashed dropzone. The selected tab pill travels in 280ms, the dropzone border and
 * fill change in 150ms while a file is over it, and indexing progress fills are animated by the rows.
 */
export function KnowledgeBasePanel({
  title,
  meta,
  tabs,
  value,
  defaultValue,
  onValueChange,
  indexing = 0,
  onSettings,
  onAddSource,
  onFiles,
  dropTitle = "Drop files here, or browse",
  dropHint = "PDF, DOCX, Markdown or TXT · Notion, Google Drive and websites from Add source",
  stages = defaultStages,
  children,
  className,
  ...props
}: KnowledgeBasePanelProps) {
  const [inner, setInner] = useState(defaultValue ?? tabs[0]?.id);
  const selectedId = value ?? inner;
  const [dragging, setDragging] = useState(false);

  const select = (id: string) => {
    setInner(id);
    onValueChange?.(id);
  };

  const over = (event: DragEvent) => {
    event.preventDefault();
    setDragging(true);
  };
  const drop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles?.(files);
  };

  return (
    <section
      className={cn(
        "flex w-full max-w-200 flex-col items-stretch gap-3 rounded-[24px] border border-border-default bg-bg-surface px-5 py-4.5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="truncate text-label-lg text-text-primary">{title}</h3>
          {meta && <p className="truncate text-caption text-text-secondary">{meta}</p>}
        </div>
        <button
          type="button"
          aria-label="Knowledge base settings"
          onClick={onSettings}
          className="flex size-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand [&>svg]:size-4"
        >
          <SlidersHorizontal aria-hidden />
        </button>
        <button
          type="button"
          onClick={onAddSource}
          className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-2.5 pl-3 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          <Plus aria-hidden className="size-3.5" />
          Add source
          <CaretDown aria-hidden className="size-3 text-text-secondary" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <PanelPillTabs
          aria-label="Sources"
          value={selectedId}
          onValueChange={select}
          items={tabs.map((tab) => ({
            value: tab.id,
            label: (
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && <span className="text-caption text-text-secondary">{tab.count}</span>}
              </span>
            ),
          }))}
        />
        <span className="flex-1" />
        {indexing > 0 && (
          <span className="flex items-center gap-2 text-caption text-text-secondary">
            <Spinner size={12} label="Indexing" />
            {indexing} indexing
          </span>
        )}
      </div>

      <div aria-hidden className="hidden items-center gap-3 px-2 pt-2 pb-1 text-caption text-text-secondary sm:flex">
        <span className="min-w-0 flex-1">Source</span>
        <span className="flex gap-1">
          {stages.map((stage) => (
            <span key={stage} className="flex h-4 w-11 shrink-0 items-center">
              {stage}
            </span>
          ))}
        </span>
        <span className="w-18 shrink-0" />
      </div>

      <div className="flex flex-col">{children}</div>

      {onFiles && (
        <label
          onDragOver={over}
          onDragEnter={over}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4.5 py-4 motion-colors has-focus-visible:outline-2 has-focus-visible:outline-text-brand",
            dragging ? "border-border-focus bg-bg-brand" : "border-overlay-ink-18 bg-transparent",
          )}
        >
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length > 0) onFiles(files);
              event.target.value = "";
            }}
          />
          <UploadSimple aria-hidden className="size-4.5 shrink-0 text-text-secondary" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-label-md text-text-primary">{dropTitle}</span>
            <span className="text-caption text-text-secondary">{dropHint}</span>
          </span>
        </label>
      )}
    </section>
  );
}
