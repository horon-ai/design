import { useState, type ReactNode } from "@lynx-js/react";

import { useMediaQuery } from "../hooks/use-media-query";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { PanelPillTabs } from "./bot-instructions-panel";

/** Strips a section's own `className` so the panel can merge its classes with the caller's. */
type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged last onto the element. */
  className?: string;
};

/** Row state of a plain field: `filled` reads fine, `check` marks a value the extractor is unsure about. */
export type ExtractFieldStatus = "filled" | "check";

/** One extracted scalar value: one row in the Fields view and one entry in the JSON view. */
export type ExtractField = {
  /** Stable identity; confirming a row records this id and drives the footer counters. */
  id: string;
  /** Row label on the left, 100px wide; also the key in the JSON view. */
  label: string;
  /** The read value, shown truncated in a button-sized pill. */
  value: string;
  /** Field type shown at the row end, for example `Text` or `Date`. */
  type?: string;
  /** `check` marks the value for confirmation: the row takes the danger border and a "Check" caption. */
  status?: ExtractFieldStatus;
};

/** One extracted table: a labelled block with a header row and body rows instead of a single value. */
export type ExtractTable = {
  /** Stable identity, counted like a field in the footer. */
  id: string;
  /** Row label above the table. */
  label: string;
  /** Field type shown at the row end, such as `Table`. */
  type?: string;
  /** Column definitions, in order; a cell reads its column by index. */
  columns: {
    /** Column heading, `caption` secondary text. */
    label: string;
    /** Cell alignment; `end` right-aligns numbers. */
    align?: "start" | "end";
    /** Fixed column width in px; a column without it shares the free width. */
    width?: number;
  }[];
  /** Body rows; each inner array is one row, matched to `columns` by index. */
  rows: string[][];
};

/** A labelled section of the Fields view, grouped under a dot and a heading. */
export type ExtractGroup = {
  /** Stable identity for the React key. */
  id: string;
  /** Section heading, `label-md` primary text. */
  label: string;
  /** Fields and tables of this section, in display order. */
  fields: (ExtractField | ExtractTable)[];
};

/** Props for {@link DocumentExtractPanel}: the sheet to view, the extracted groups and the footer actions. */
export type DocumentExtractPanelProps = WithClass<{
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
}> & {
  /** Document name in the viewer toolbar; `label-md` primary text, truncated. */
  fileName: string;
  /** Page indicator at the right of the toolbar. @default "1 / 1" */
  pageLabel?: string;
  /** The paper sheet content. Wrap fields in `ExtractHighlight` to outline what was read. */
  sheet: ReactNode;
  /** Extracted sections, in display order; the same data feeds the Fields, JSON and Schema views. */
  groups: ExtractGroup[];
  /** Starting zoom the toolbar shows; 70 draws the sheet at its design size (scale 1) and the range is 30–150. @default 70 */
  defaultZoom?: number;
  /** Bot credited in the footer; without it the footer shows no attribution. */
  bot?: {
    /** One-letter mark on the 20px brand square. */
    initial: string;
    /** Bot name, `caption` secondary text. */
    name: string;
    /** Optional run time appended as "· 12s". */
    elapsed?: string;
  };
  /** Fires when the Extract button is pressed; the panel also bumps its run counter, which remounts the active view and replays its entry animation. */
  onExtract?: () => void;
  /** Fires after Accept all has queued the confirmation of every row, so the confirmed marks land on the next render. */
  onAcceptAll?: () => void;
  /** Makes the file name actionable; without it the name is a plain label. */
  onOpenFile?: () => void;
};

/** Lowest and highest zoom the toolbar allows, and the step of one press. */
const ZOOM_MIN = 30;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;
/** The fit zoom: 100% of the sheet box is drawn at this percent, so the default 70 shows it at its design size. */
const ZOOM_FIT = 70;

/** The two-column split is react's `@4xl` container breakpoint; Lynx has no container queries, so the window width decides. */
const SPLIT_QUERY = "(min-width: 1024px)";

/** Outline colours for `ExtractHighlight`: brand-family tints for reads, neutral and ink for notes and marks. */
const highlightTone = {
  sky: "border-accent-sky-500-90 bg-accent-sky-500-12",
  brand: "border-accent-sky-700-90 bg-accent-sky-700-12",
  neutral: "border-text-placeholder-90 bg-text-placeholder-12",
  ink: "border-interactive-primary bg-overlay-ink-12",
} as const;

type HighlightTone = keyof typeof highlightTone;

/**
 * An outline over a value on the sheet, the 4px-radius 1.2px box Paper draws where a field was read.
 *
 * React drew a `div` with a 1.2px ring; Lynx has no ring, so the same outline is a 1.2px border on a
 * `view`, which keeps the documented 4px radius and the tone fill.
 *
 * @example
 * ```tsx
 * import { ExtractHighlight } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return <ExtractHighlight tone="brand">INV-2026-0418</ExtractHighlight>;
 * }
 * ```
 */
export function ExtractHighlight({
  tone = "sky",
  className,
  children,
}: WithClass<{
  /** Outline and fill pair: `sky` for a normal read, `brand` for a highlighted one, `neutral` and `ink` for notes. @default "sky" */
  tone?: HighlightTone;
  /** The content inside the outline. */
  children?: ReactNode;
}>) {
  return (
    <view className={cn("flex flex-col gap-px rounded-sm border-[1.2px] px-1 py-0.5", highlightTone[tone], className)}>
      {children}
    </view>
  );
}

/** Narrows an extracted entry to a table by the one member only a table carries. */
const isTable = (field: ExtractField | ExtractTable): field is ExtractTable => "rows" in field;

/** One hairline between the panel's regions; `vertical` draws it as a column rule for the split layout. */
function Divider({
  /** Draws a column rule instead of a row rule. */
  vertical,
}: {
  vertical?: boolean;
}) {
  return (
    <view
      className={cn("shrink-0 bg-overlay-ink-8", vertical ? "w-px self-stretch" : "h-px self-stretch")}
      accessibility-role-description="separator"
    />
  );
}

/** The zoom steps share one look; Lynx dims a disabled view through `opacity-40`. */
const STEP_CLASS =
  "flex size-6 shrink-0 flex-row items-center justify-center rounded-full text-text-primary motion-press active:bg-overlay-ink-8";

/**
 * Document extract panel (Paper `YUT-1` / `GWP-0`): a viewer with zoom controls on the left and the extracted
 * fields on the right, with Fields / JSON / Schema views, a per-row confirmation check and an Accept all footer.
 *
 * React laid this out with container queries; Lynx has none, so the window width decides: the columns stack
 * below 1024px and split above it, with the viewer column fixed at 540px. Zoom runs 30–150 in steps of 10,
 * "Fit" returns to 70 (the sheet's design size), and the sheet is transformed from its top edge, so it never
 * reflows. A field with `status: "check"` renders as a button that confirms that one row; Accept all confirms
 * every row at once. The footer counts filled and unresolved rows, keeps a dot per field and credits the bot
 * when `bot` is set.
 *
 * @example
 * ```tsx
 * import { DocumentExtractPanel } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <DocumentExtractPanel
 *       fileName="invoice-0424.pdf"
 *       groups={[
 *         {
 *           id: "vendor",
 *           label: "Vendor",
 *           fields: [
 *             { id: "name", label: "Name", value: "Northwind Supply", type: "Text" },
 *             { id: "due", label: "Due", value: "Oct 24, 2026", type: "Date", status: "check" },
 *           ],
 *         },
 *       ]}
 *       sheet={<text className="text-title-md text-neutral-900">Northwind Supply</text>}
 *       onAcceptAll={() => saveExtraction()}
 *     />
 *   );
 * }
 * ```
 */
export function DocumentExtractPanel({
  fileName,
  pageLabel = "1 / 1",
  sheet,
  groups,
  defaultZoom = ZOOM_FIT,
  bot,
  onExtract,
  onAcceptAll,
  onOpenFile,
  className,
  id,
}: DocumentExtractPanelProps) {
  const [zoom, setZoom] = useState(defaultZoom);
  const [view, setView] = useState("fields");
  const [resolved, setResolved] = useState<Set<string>>(() => new Set());
  const [run, setRun] = useState(0);
  const wide = useMediaQuery(SPLIT_QUERY, true);

  const flat = groups.flatMap((group) => group.fields);
  const total = flat.length;
  const needs = (field: ExtractField | ExtractTable) =>
    !isTable(field) && field.status === "check" && !resolved.has(field.id);
  const toCheck = flat.filter(needs).length;
  const filled = total - toCheck;

  const resolve = (fieldId: string) => setResolved((previous) => new Set(previous).add(fieldId));
  const acceptAll = () => {
    setResolved(new Set(flat.map((field) => field.id)));
    onAcceptAll?.();
  };
  const json = JSON.stringify(
    Object.fromEntries(
      flat.map((field) => [
        field.label,
        isTable(field)
          ? field.rows.map((row) =>
              Object.fromEntries(field.columns.map((column, index) => [column.label, row[index]])),
            )
          : field.value,
      ]),
    ),
    null,
    2,
  );

  let rowIndex = 0;

  return (
    <view
      className={cn(
        "flex w-full min-w-0 max-w-[1120px] flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...(id === undefined ? {} : { id })}
    >
      <view className={cn("flex", wide ? "flex-row" : "flex-col")}>
        <view className={cn("flex min-w-0 flex-col", wide && "w-[540px] shrink-0")}>
          <view className="flex flex-row flex-wrap items-center gap-2 px-5 py-3">
            <view className="flex size-7 shrink-0 flex-row items-center justify-center rounded-[10px] bg-overlay-ink-5">
              <Icon name="FilePdf" size={16} color="text-danger" />
            </view>
            {onOpenFile ? (
              <view
                className="flex min-w-0 flex-row items-center gap-1 rounded-md"
                bindtap={onOpenFile}
                accessibility-element
                accessibility-traits="button"
                accessibility-label={fileName}
              >
                <text className="truncate text-label-md text-text-primary">{fileName}</text>
                <Icon name="CaretDown" size={14} color="text-secondary" />
              </view>
            ) : (
              <view className="min-w-0">
                <text className="truncate text-label-md text-text-primary">{fileName}</text>
              </view>
            )}
            <view className="min-w-0 flex-1" />
            <text className="shrink-0 text-caption text-text-secondary">{pageLabel}</text>
            <view className="flex h-[30px] shrink-0 flex-row items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]">
              <view
                className={cn(STEP_CLASS, zoom <= ZOOM_MIN && "opacity-40")}
                bindtap={() => setZoom((value) => Math.max(ZOOM_MIN, value - ZOOM_STEP))}
                accessibility-element
                accessibility-traits={zoom <= ZOOM_MIN ? "disabled" : "button"}
                accessibility-label="Zoom out"
              >
                <Icon name="Minus" size={14} color="text-primary" />
              </view>
              <view className="w-9 flex-row items-center justify-center">
                <text className="text-label-sm tabular-nums text-text-primary">{`${zoom}%`}</text>
              </view>
              <view
                className={cn(STEP_CLASS, zoom >= ZOOM_MAX && "opacity-40")}
                bindtap={() => setZoom((value) => Math.min(ZOOM_MAX, value + ZOOM_STEP))}
                accessibility-element
                accessibility-traits={zoom >= ZOOM_MAX ? "disabled" : "button"}
                accessibility-label="Zoom in"
              >
                <Icon name="Plus" size={14} color="text-primary" />
              </view>
            </view>
            <view
              className="motion-press flex h-[30px] shrink-0 flex-row items-center justify-center rounded-full bg-overlay-ink-6 pl-3 pr-3.5 active:bg-overlay-ink-8"
              bindtap={() => setZoom(ZOOM_FIT)}
              accessibility-element
              accessibility-traits="button"
              accessibility-label="Fit"
            >
              <text className="text-label-sm text-text-primary">Fit</text>
            </view>
          </view>
          <view className="flex min-h-[480px] flex-1 flex-row items-start justify-center overflow-hidden bg-overlay-ink-7 px-6 py-5">
            <view
              className="flex w-full max-w-[470px] shrink-0 flex-col gap-3.5 border border-overlay-ink-8 bg-neutral-50 px-[26px] pb-5 pt-[26px]"
              style={{
                boxShadow: "0 2px 4px #00000014",
                transform: `scale(${zoom / ZOOM_FIT})`,
                transformOrigin: "top center",
              }}
            >
              {sheet}
            </view>
          </view>
        </view>
        <Divider vertical={wide} />
        <view className="flex min-w-0 flex-1 flex-col">
          <view className="flex flex-row items-center gap-2 px-5 py-3">
            <PanelPillTabs
              aria-label="Extraction view"
              value={view}
              onValueChange={setView}
              items={[
                { value: "fields", label: "Fields" },
                { value: "json", label: "JSON" },
                { value: "schema", label: "Schema" },
              ]}
            />
            <view className="min-w-0 flex-1" />
            <view
              className="motion-press flex h-[30px] shrink-0 flex-row items-center justify-center gap-1.5 rounded-full bg-overlay-ink-6 pl-3.5 pr-3 active:bg-overlay-ink-10"
              bindtap={() => {
                setRun((value) => value + 1);
                onExtract?.();
              }}
              accessibility-element
              accessibility-traits="button"
              accessibility-label="Extract"
            >
              <Icon name="Scan" size={14} color="text-primary" />
              <text className="text-label-sm text-text-primary">Extract</text>
            </view>
          </view>
          <Divider />
          <view key={`${view}-${run}`} className="flex flex-col gap-1.5 px-5 pb-4 pt-3.5">
            {view === "fields" ? (
              <>
                <text className="text-body-sm text-text-secondary">{`${total} fields read from this document`}</text>
                {groups.map((group) => (
                  <view key={group.id} className="flex flex-col gap-1.5">
                    <view className="flex flex-row items-center gap-2 pb-1 pt-3">
                      <view className="size-[7px] rounded-full bg-sky-500" />
                      <text className="text-label-md text-text-primary">{group.label}</text>
                    </view>
                    {group.fields.map((field) => {
                      const delay = { animationDelay: `${rowIndex++ * 30}ms` };
                      if (isTable(field)) {
                        return (
                          <view key={field.id} className="motion-rise flex flex-col gap-1.5" style={delay}>
                            <view className="flex flex-row items-center gap-3">
                              <view className="w-[100px] shrink-0">
                                <text className="text-body-sm text-text-secondary">{field.label}</text>
                              </view>
                              <view className="min-w-0 flex-1" />
                              {field.type ? (
                                <view className="w-[56px] shrink-0">
                                  <text className="text-right text-caption text-text-secondary">{field.type}</text>
                                </view>
                              ) : null}
                            </view>
                            <scroll-view
                              scroll-orientation="horizontal"
                              className="rounded-[10px] border border-overlay-ink-10 px-3 py-0.5"
                            >
                              <view className="flex min-w-[208px] flex-col">
                                <view className="flex flex-row items-center gap-2 py-2">
                                  {field.columns.map((column) => (
                                    <view
                                      key={column.label}
                                      className={cn(column.width ? "shrink-0" : "min-w-0 flex-1")}
                                      style={column.width ? { width: `${column.width}px` } : undefined}
                                    >
                                      <text
                                        className={cn(
                                          "text-caption text-text-secondary",
                                          column.align === "end" && "text-right",
                                        )}
                                      >
                                        {column.label}
                                      </text>
                                    </view>
                                  ))}
                                </view>
                                {field.rows.map((row) => (
                                  <view key={row.join("|")} className="flex flex-row items-center gap-2 py-2">
                                    {row.map((cell, index) => {
                                      const column = field.columns[index];
                                      return (
                                        <view
                                          key={column?.label ?? cell}
                                          className={cn(column?.width ? "shrink-0" : "min-w-0 flex-1")}
                                          style={column?.width ? { width: `${column.width}px` } : undefined}
                                        >
                                          <text
                                            className={cn(
                                              "text-caption text-text-primary",
                                              column?.align === "end" && "text-right",
                                            )}
                                          >
                                            {cell}
                                          </text>
                                        </view>
                                      );
                                    })}
                                  </view>
                                ))}
                              </view>
                            </scroll-view>
                          </view>
                        );
                      }
                      const needsCheck = needs(field);
                      return (
                        <view
                          key={field.id}
                          className="motion-rise flex flex-row flex-wrap items-center gap-3"
                          style={delay}
                        >
                          <view className="w-[100px] shrink-0">
                            <text className="text-body-sm text-text-secondary">{field.label}</text>
                          </view>
                          <view
                            className={cn(
                              "motion-colors flex h-9 min-w-0 flex-1 flex-row items-center gap-2 rounded-[10px] border px-3",
                              needsCheck
                                ? "border-border-danger bg-overlay-ink-12 active:bg-overlay-ink-14"
                                : "border-transparent bg-overlay-ink-4",
                            )}
                            bindtap={needsCheck ? () => resolve(field.id) : undefined}
                            accessibility-element
                            accessibility-traits={needsCheck ? "button" : "disabled"}
                            accessibility-label={needsCheck ? `Confirm ${field.label}` : undefined}
                          >
                            <view className="min-w-0 flex-1">
                              <text className="truncate text-body-sm text-text-primary">{field.value}</text>
                            </view>
                            {needsCheck ? (
                              <text className="shrink-0 text-caption text-text-danger">Check</text>
                            ) : (
                              <Icon name="Check" size={14} weight="bold" color="text-secondary" />
                            )}
                          </view>
                          {field.type ? (
                            <view className="w-[56px] shrink-0">
                              <text className="text-right text-caption text-text-secondary">{field.type}</text>
                            </view>
                          ) : null}
                        </view>
                      );
                    })}
                  </view>
                ))}
              </>
            ) : null}
            {view === "json" ? (
              <scroll-view scroll-orientation="horizontal" className="rounded-[10px] bg-overlay-ink-4 p-3">
                <text className="whitespace-pre font-mono text-caption text-text-primary">{json}</text>
              </scroll-view>
            ) : null}
            {view === "schema" ? (
              <view className="flex flex-col gap-1.5">
                {flat.map((field) => (
                  <view key={field.id} className="flex flex-row items-center gap-3">
                    <view className="w-[100px] shrink-0">
                      <text className="text-body-sm text-text-secondary">{field.label}</text>
                    </view>
                    <view className="rounded-md bg-overlay-ink-6 px-1.5 py-px">
                      <text className="text-caption text-text-secondary">{field.type ?? "Text"}</text>
                    </view>
                  </view>
                ))}
              </view>
            ) : null}
          </view>
        </view>
      </view>
      <Divider />
      <view className="flex flex-row flex-wrap items-center gap-3 px-5 py-3">
        <view className="flex flex-row items-center gap-1" accessibility-elements-hidden>
          {flat.map((field) => (
            <view
              key={field.id}
              className={cn("motion-colors size-2 rounded-full", needs(field) ? "bg-red-500" : "bg-sky-500")}
            />
          ))}
        </view>
        <text className="text-body-sm text-text-secondary">{`${filled} of ${total} filled · ${toCheck} to check`}</text>
        <view className="min-w-0 flex-1" />
        {bot ? (
          <view className="flex flex-row items-center gap-2">
            <view className="flex size-5 flex-row items-center justify-center rounded-[5px] bg-interactive-primary">
              <text className="text-label-sm text-text-inverse">{bot.initial}</text>
            </view>
            <text className="text-caption text-text-secondary">
              {bot.elapsed ? `${bot.name} · ${bot.elapsed}` : bot.name}
            </text>
          </view>
        ) : null}
        <view
          className="motion-press flex h-[30px] shrink-0 flex-row items-center justify-center rounded-full bg-interactive-primary pl-3.5 pr-3 active:bg-interactive-primary-hover"
          bindtap={acceptAll}
          accessibility-element
          accessibility-traits="button"
        >
          <text className="text-label-sm text-text-inverse">Accept all</text>
        </view>
      </view>
    </view>
  );
}
