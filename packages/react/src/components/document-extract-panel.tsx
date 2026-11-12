import { CaretDown, Check, FilePdf, Minus, Plus, Scan } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";

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
export type DocumentExtractPanelProps = WithClass<Omit<ComponentProps<"section">, "title">> & {
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

/** Outline colours for `ExtractHighlight`: brand-family tints for reads, neutral and ink for notes and marks. */
const highlightTone = {
  sky: "border-accent-sky-500-90 bg-accent-sky-500-12",
  brand: "border-accent-sky-700-90 bg-accent-sky-700-12",
  neutral: "border-text-placeholder-90 bg-text-placeholder-12",
  ink: "border-interactive-primary bg-overlay-ink-12",
} as const;

/** An outline over a value on the sheet, the 4px-radius 1.2px box Paper draws where a field was read. */
export function ExtractHighlight({
  tone = "sky",
  className,
  ...props
}: WithClass<ComponentProps<"div">> & {
  /** Outline and fill pair: `sky` for a normal read, `brand` for a highlighted one, `neutral` and `ink` for notes. @default "sky" */
  tone?: keyof typeof highlightTone;
}) {
  return (
    <div
      className={cn("flex flex-col gap-px rounded-sm border-[1.2px] px-1 py-0.5", highlightTone[tone], className)}
      {...props}
    />
  );
}

function isTable(field: ExtractField | ExtractTable): field is ExtractTable {
  return "rows" in field;
}

function isChecked(field: ExtractField, resolved: Set<string>) {
  return field.status === "check" && !resolved.has(field.id);
}

/** One hairline between the panel's regions; `vertical` draws it as a column rule for the split layout. */
// prettier-ignore
function Divider({ vertical }: {
  /** Draws a column rule instead of a row rule. */
  vertical?: boolean;
}) {
  return (
    <div
      role="separator"
      className={cn("shrink-0 bg-overlay-ink-8", vertical ? "w-px self-stretch" : "h-px self-stretch")}
    />
  );
}

function stepClass() {
  return "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-primary motion-press hover:bg-overlay-ink-8 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-text-brand";
}

/**
 * Document extract panel (Paper `YUT-1` / `GWP-0`): a viewer with zoom controls on the left and the extracted
 * fields on the right, with Fields / JSON / Schema views, a per-row confirmation check and an Accept all footer.
 *
 * Laid out with container queries, not the viewport: the two columns stack below the 4xl container width and
 * split above it, with the viewer column fixed at 540px. Zoom runs 30–150 in steps of 10, "Fit" returns to 70
 * (the sheet's design size), and the sheet is scaled from its top edge, so it never reflows. A field with
 * `status: "check"` renders as a button that confirms that one row; Accept all confirms every row at once.
 * The footer counts filled and unresolved rows, keeps a dot per field and credits the bot when `bot` is set.
 *
 * @example
 * ```tsx
 * <DocumentExtractPanel
 *   fileName="invoice-0424.pdf"
 *   groups={[
 *     {
 *       id: "vendor",
 *       label: "Vendor",
 *       fields: [
 *         { id: "name", label: "Name", value: "Northwind Supply", type: "Text" },
 *         { id: "due", label: "Due", value: "Oct 24, 2026", type: "Date", status: "check" },
 *       ],
 *     },
 *   ]}
 *   sheet={<h1 className="text-title-md">Northwind Supply</h1>}
 *   onAcceptAll={() => saveExtraction()}
 * />
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
  ...props
}: DocumentExtractPanelProps) {
  const [zoom, setZoom] = useState(defaultZoom);
  const [view, setView] = useState("fields");
  const [resolved, setResolved] = useState<Set<string>>(() => new Set());
  const [run, setRun] = useState(0);

  const flat = useMemo(() => groups.flatMap((group) => group.fields), [groups]);
  const total = flat.length;
  const toCheck = flat.filter((field) => !isTable(field) && isChecked(field, resolved)).length;
  const filled = total - toCheck;

  const resolve = (id: string) => setResolved((previous) => new Set(previous).add(id));
  const acceptAll = () => {
    setResolved(new Set(flat.map((field) => field.id)));
    onAcceptAll?.();
  };
  const json = useMemo(() => {
    const data: Record<string, unknown> = {};
    for (const field of flat) {
      data[field.label] = isTable(field)
        ? field.rows.map((row) => Object.fromEntries(field.columns.map((column, index) => [column.label, row[index]])))
        : field.value;
    }
    return JSON.stringify(data, null, 2);
  }, [flat]);

  let rowIndex = 0;

  return (
    <section
      className={cn(
        "@container flex w-full max-w-280 min-w-0 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col @4xl:flex-row">
        <div className="flex min-w-0 flex-col @4xl:w-135 @4xl:shrink-0">
          <div className="flex flex-wrap items-center gap-2 px-5 py-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-overlay-ink-5 text-text-danger">
              <FilePdf aria-hidden className="size-4" />
            </span>
            {onOpenFile ? (
              <button
                type="button"
                onClick={onOpenFile}
                className="flex min-w-0 cursor-pointer items-center gap-1 rounded-md text-left focus-visible:outline-2 focus-visible:outline-text-brand"
              >
                <span className="min-w-0 truncate text-label-md text-text-primary">{fileName}</span>
                <CaretDown aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
              </button>
            ) : (
              <span className="min-w-0 truncate text-label-md text-text-primary">{fileName}</span>
            )}
            <span className="min-w-0 flex-1" />
            <span className="shrink-0 text-caption text-text-secondary">{pageLabel}</span>
            <div className="flex h-7.5 shrink-0 items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]">
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoom <= ZOOM_MIN}
                onClick={() => setZoom((value) => Math.max(ZOOM_MIN, value - ZOOM_STEP))}
                className={stepClass()}
              >
                <Minus aria-hidden className="size-3.5" />
              </button>
              <span className="w-9 text-center text-label-sm text-text-primary tabular-nums">{zoom}%</span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoom >= ZOOM_MAX}
                onClick={() => setZoom((value) => Math.min(ZOOM_MAX, value + ZOOM_STEP))}
                className={stepClass()}
              >
                <Plus aria-hidden className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setZoom(ZOOM_FIT)}
              className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 pr-3.5 pl-3 text-label-sm text-text-primary hover:bg-overlay-ink-8 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              Fit
            </button>
          </div>
          <div className="flex min-h-120 flex-1 justify-center overflow-hidden bg-overlay-ink-7 px-6 py-5">
            <div
              className="flex h-fit w-full max-w-117.5 shrink-0 origin-top flex-col gap-3.5 bg-neutral-50 px-6.5 pt-6.5 pb-5 text-neutral-900 ring-1 ring-overlay-ink-8 [filter:drop-shadow(0_2px_4px_#00000014)] transition-[scale] duration-220 ease-out-quint"
              style={{ scale: zoom / ZOOM_FIT }}
            >
              {sheet}
            </div>
          </div>
        </div>
        <Divider vertical />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 px-5 py-3">
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
            <span className="min-w-0 flex-1" />
            <button
              type="button"
              onClick={() => {
                setRun((value) => value + 1);
                onExtract?.();
              }}
              className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center justify-center gap-1.5 rounded-full bg-overlay-ink-6 pr-3 pl-3.5 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              <Scan aria-hidden className="size-3.5" />
              Extract
            </button>
          </div>
          <Divider />
          <div key={`${view}-${run}`} className="flex flex-col gap-1.5 px-5 pt-3.5 pb-4">
            {view === "fields" ? (
              <>
                <p className="text-body-sm text-text-secondary">{total} fields read from this document</p>
                {groups.map((group) => (
                  <div key={group.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 pt-3 pb-1">
                      <span aria-hidden className="size-1.75 rounded-full bg-sky-500" />
                      <h4 className="text-label-md text-text-primary">{group.label}</h4>
                    </div>
                    {group.fields.map((field) => {
                      const delay = { animationDelay: `${rowIndex++ * 30}ms` };
                      if (isTable(field)) {
                        return (
                          <div key={field.id} className="flex motion-rise flex-col gap-1.5" style={delay}>
                            <div className="flex items-center gap-3">
                              <span className="w-25 shrink-0 text-body-sm text-text-secondary">{field.label}</span>
                              <span className="min-w-0 flex-1" />
                              {field.type ? (
                                <span className="w-14 shrink-0 text-end text-caption text-text-secondary">
                                  {field.type}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-col overflow-x-auto rounded-md border border-overlay-ink-10 px-3 py-0.5">
                              <div className="flex min-w-52 flex-col">
                                <div className="flex items-center gap-2 py-2 text-caption text-text-secondary">
                                  {field.columns.map((column) => (
                                    <span
                                      key={column.label}
                                      className={cn(
                                        column.width ? "shrink-0" : "min-w-0 flex-1",
                                        column.align === "end" && "text-end",
                                      )}
                                      style={column.width ? { width: column.width } : undefined}
                                    >
                                      {column.label}
                                    </span>
                                  ))}
                                </div>
                                {field.rows.map((row) => (
                                  <div
                                    key={row.join("|")}
                                    className="flex items-center gap-2 py-2 text-caption text-text-primary"
                                  >
                                    {row.map((cell, index) => {
                                      const column = field.columns[index];
                                      return (
                                        <span
                                          key={column?.label ?? cell}
                                          className={cn(
                                            column?.width ? "shrink-0" : "min-w-0 flex-1",
                                            column?.align === "end" && "text-end",
                                          )}
                                          style={column?.width ? { width: column.width } : undefined}
                                        >
                                          {cell}
                                        </span>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      const needsCheck = isChecked(field, resolved);
                      return (
                        <div key={field.id} className="flex motion-rise flex-wrap items-center gap-3" style={delay}>
                          <span className="w-25 shrink-0 text-body-sm text-text-secondary">{field.label}</span>
                          <button
                            type="button"
                            disabled={!needsCheck}
                            onClick={() => resolve(field.id)}
                            aria-label={needsCheck ? `Confirm ${field.label}` : undefined}
                            className={cn(
                              "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border px-3 text-start motion-colors",
                              needsCheck
                                ? "cursor-pointer border-border-danger bg-overlay-ink-12 hover:bg-overlay-ink-14 focus-visible:outline-2 focus-visible:outline-text-brand"
                                : "cursor-default border-transparent bg-overlay-ink-4",
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">
                              {field.value}
                            </span>
                            {needsCheck ? (
                              <span className="shrink-0 text-caption text-text-danger">Check</span>
                            ) : (
                              <Check
                                aria-hidden
                                weight="bold"
                                className="size-3.5 shrink-0 animate-pop-in text-text-secondary"
                              />
                            )}
                          </button>
                          {field.type ? (
                            <span className="w-14 shrink-0 text-end text-caption text-text-secondary">
                              {field.type}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : null}
            {view === "json" ? (
              <pre className="animate-slide-shift-next overflow-x-auto rounded-md bg-overlay-ink-4 p-3 font-mono text-caption whitespace-pre text-text-primary">
                {json}
              </pre>
            ) : null}
            {view === "schema" ? (
              <ul className="flex animate-slide-shift-next flex-col gap-1.5">
                {flat.map((field) => (
                  <li key={field.id} className="flex items-center gap-3 text-body-sm text-text-primary">
                    <span className="w-25 shrink-0 text-text-secondary">{field.label}</span>
                    <span className="rounded-md bg-overlay-ink-6 px-1.5 py-px text-caption text-text-secondary">
                      {field.type ?? "Text"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-wrap items-center gap-3 px-5 py-3">
        <div className="flex items-center gap-1" aria-hidden>
          {flat.map((field) => (
            <span
              key={field.id}
              className={cn(
                "size-2 rounded-full motion-colors",
                !isTable(field) && isChecked(field, resolved) ? "bg-red-500" : "bg-sky-500",
              )}
            />
          ))}
        </div>
        <span className="text-body-sm text-text-secondary">
          {filled} of {total} filled · {toCheck} to check
        </span>
        <span className="min-w-0 flex-1" />
        {bot ? (
          <>
            <span className="flex size-5 items-center justify-center rounded-xs bg-interactive-primary text-label-sm text-text-inverse">
              {bot.initial}
            </span>
            <span className="text-caption text-text-secondary">
              {bot.name}
              {bot.elapsed ? ` · ${bot.elapsed}` : ""}
            </span>
          </>
        ) : null}
        <button
          type="button"
          onClick={acceptAll}
          className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-interactive-primary pr-3 pl-3.5 text-label-sm text-text-inverse hover:bg-interactive-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
        >
          Accept all
        </button>
      </div>
    </section>
  );
}
