import { useState, type ReactNode } from "@lynx-js/react";

import { useMediaQuery } from "../hooks/use-media-query";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { PanelPillTabs } from "./bot-instructions-panel";
import { Spinner } from "./spinner";

/** One pill tab of {@link KnowledgeBasePanel}, such as "All" or "Documents". */
export type KnowledgeBaseTab = {
  /** Stable identifier; it is the tab's value and React key. */
  id: string;
  /** Tab text. */
  label: ReactNode;
  /** Optional count drawn in caption colour right of the label. */
  count?: number;
};

/** Props for {@link KnowledgeBasePanel}: header, tabs, indexing state and the dropzone handler. */
export type KnowledgeBasePanelProps = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Panel heading, drawn as the panel's `label-lg` title. */
  title: ReactNode;
  /** The 12/18 line under the title: sources, chunks, bots. */
  meta?: ReactNode;
  /** Pills of the tab tray, in display order. */
  tabs: KnowledgeBaseTab[];
  /** Controlled selected tab id. Leave unset to let the component hold the selection itself. */
  value?: string;
  /** Initial selected tab when uncontrolled. Falls back to the first tab. */
  defaultValue?: string;
  /** Fires with the new tab id when a pill is clicked. */
  onValueChange?: (id: string) => void;
  /** Shows the spinner and "N indexing" at the right of the tabs when above zero.
   * @default 0 */
  indexing?: number;
  /** Fires when the round settings button is clicked; the button always renders. */
  onSettings?: () => void;
  /** Fires when "Add source" is clicked; the button always renders. */
  onAddSource?: () => void;
  /**
   * Called with the files dropped on the dropzone or picked with Browse. Omit to hide the dropzone.
   * A Lynx host owns file picking, so its `File`-like objects are its own; the panel only decides whether
   * the dropzone exists.
   */
  onFiles?: (files: File[]) => void;
  /** Headline inside the dropzone.
   * @default "Drop files here, or browse" */
  dropTitle?: ReactNode;
  /** Supporting line under the dropzone headline.
   * @default "PDF, DOCX, Markdown or TXT · Notion, Google Drive and websites from Add source" */
  dropHint?: ReactNode;
  /** Pipeline column labels shown above the list; hidden on narrow widths.
   * @default ["Parse", "Chunk", "Embed", "Index"] */
  stages?: string[];
  /** The list rows, usually `SourceRow variant="list"`. */
  children?: ReactNode;
  /** Extra classes on the panel root, merged after the built-in ones. */
  className?: string;
};

const defaultStages = ["Parse", "Chunk", "Embed", "Index"];

/** The narrow layout drops the pipeline head, as react's `sm:flex` does. */
const WIDE_QUERY = "(min-width: 640px)";

/**
 * Paper `Knowledge base` (XVM-1): a 24px-radius surface panel with a header, a pill tab tray, a table head, a
 * flat divided source list and a dashed dropzone. The selected tab pill travels in 280ms and the indexing
 * count slides in beside the tabs.
 *
 * Lynx has no `File`, no `dataTransfer` and no file input, so the dropzone cannot accept a drop or open a
 * picker: it is drawn, under the same `onFiles` gate as react, as the place a host puts its own native
 * picker. The list itself is passed as `children`, so an empty list is simply a panel without rows.
 *
 * @example
 * ```tsx
 * import { KnowledgeBasePanel } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <KnowledgeBasePanel
 *       title="Knowledge base"
 *       meta="3 sources · 128 chunks"
 *       tabs={[{ id: "all", label: "All", count: 3 }]}
 *       indexing={2}
 *       onAddSource={openSourcePicker}
 *       onFiles={upload}
 *     />
 *   );
 * }
 * ```
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
  id,
}: KnowledgeBasePanelProps) {
  const [inner, setInner] = useState(defaultValue ?? tabs[0]?.id);
  const selectedId = value ?? inner;
  const wide = useMediaQuery(WIDE_QUERY, true);

  const select = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };

  return (
    <view
      className={cn(
        "py-4.5 flex w-full min-w-0 max-w-[800px] flex-col items-stretch gap-3 rounded-[24px] border border-border-default bg-bg-surface px-5",
        className,
      )}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex min-w-0 flex-row flex-wrap items-center gap-2">
        <view className="flex min-w-0 flex-1 flex-col gap-0.5">
          {typeof title === "string" || typeof title === "number" ? (
            <text className="truncate text-label-lg text-text-primary">{title}</text>
          ) : (
            title
          )}
          {meta ? (
            typeof meta === "string" || typeof meta === "number" ? (
              <text className="truncate text-caption text-text-secondary">{meta}</text>
            ) : (
              meta
            )
          ) : null}
        </view>
        <view
          className="motion-press flex size-[30px] shrink-0 flex-row items-center justify-center rounded-full bg-overlay-ink-6 active:bg-overlay-ink-10"
          bindtap={onSettings}
          accessibility-element
          accessibility-traits="button"
          accessibility-label="Knowledge base settings"
        >
          <Icon name="SlidersHorizontal" size={16} color="text-primary" />
        </view>
        <view
          className="motion-press flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 pl-3 pr-2.5 active:bg-overlay-ink-10"
          bindtap={onAddSource}
          accessibility-element
          accessibility-traits="button"
        >
          <Icon name="Plus" size={14} color="text-primary" />
          <text className="text-label-sm text-text-primary">Add source</text>
          <Icon name="CaretDown" size={12} color="text-secondary" />
        </view>
      </view>

      <view className="flex flex-row flex-wrap items-center gap-2">
        <PanelPillTabs
          aria-label="Sources"
          value={selectedId}
          onValueChange={select}
          items={tabs.map((tab) => ({
            value: tab.id,
            label: (
              <view className="flex flex-row items-center gap-1.5">
                {typeof tab.label === "string" || typeof tab.label === "number" ? (
                  <text className="text-label-md text-text-primary">{tab.label}</text>
                ) : (
                  tab.label
                )}
                {tab.count === undefined ? null : (
                  <text className="text-caption text-text-secondary">{`${tab.count}`}</text>
                )}
              </view>
            ),
          }))}
        />
        <view className="min-w-0 flex-1" />
        {indexing > 0 ? (
          <view className="flex shrink-0 flex-row items-center gap-2">
            <Spinner size={12} label="Indexing" />
            <text className="text-caption tabular-nums text-text-secondary">{`${indexing} indexing`}</text>
          </view>
        ) : null}
      </view>

      {wide ? (
        <view className="flex flex-row items-center gap-3 px-2 pb-1 pt-2" accessibility-elements-hidden>
          <view className="min-w-0 flex-1">
            <text className="text-caption text-text-secondary">Source</text>
          </view>
          <view className="flex flex-row gap-1">
            {stages.map((stage) => (
              <view key={stage} className="flex h-4 w-11 shrink-0 flex-row items-center">
                <text className="text-caption text-text-secondary">{stage}</text>
              </view>
            ))}
          </view>
          <view className="w-[72px] shrink-0" />
        </view>
      ) : null}

      <view className="flex flex-col">{children}</view>

      {onFiles ? (
        <view
          className="px-4.5 motion-colors flex flex-row items-center gap-3 rounded-2xl border border-dashed border-overlay-ink-18 py-4"
          accessibility-elements-hidden
        >
          <Icon name="UploadSimple" size={18} color="text-secondary" />
          <view className="flex min-w-0 flex-col gap-0.5">
            {typeof dropTitle === "string" || typeof dropTitle === "number" ? (
              <text className="break-all text-label-md text-text-primary">{dropTitle}</text>
            ) : (
              dropTitle
            )}
            {typeof dropHint === "string" || typeof dropHint === "number" ? (
              <text className="break-all text-caption text-text-secondary">{dropHint}</text>
            ) : (
              dropHint
            )}
          </view>
        </view>
      ) : null}
    </view>
  );
}
