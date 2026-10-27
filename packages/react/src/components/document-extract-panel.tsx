import { CaretDown, Check, FilePdf, Minus, Plus, Scan } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";

import { cn } from "../lib/cn";
import { PanelPillTabs } from "./bot-instructions-panel";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export type ExtractFieldStatus = "filled" | "check";

export type ExtractField = {
  id: string;
  label: string;
  value: string;
  /** Field type shown at the row end, for example `Text` or `Date`. */
  type?: string;
  status?: ExtractFieldStatus;
};

export type ExtractTable = {
  id: string;
  label: string;
  type?: string;
  columns: { label: string; align?: "start" | "end"; width?: number }[];
  rows: string[][];
};

export type ExtractGroup = {
  id: string;
  label: string;
  fields: (ExtractField | ExtractTable)[];
};

export type DocumentExtractPanelProps = WithClass<Omit<ComponentProps<"section">, "title">> & {
  fileName: string;
  pageLabel?: string;
  /** The paper sheet content. Wrap fields in `ExtractHighlight` to outline what was read. */
  sheet: ReactNode;
  groups: ExtractGroup[];
  defaultZoom?: number;
  bot?: { initial: string; name: string; elapsed?: string };
  onExtract?: () => void;
  onAcceptAll?: () => void;
};

const ZOOM_MIN = 30;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;
const ZOOM_FIT = 70;

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
}: WithClass<ComponentProps<"div">> & { tone?: keyof typeof highlightTone }) {
  return <div className={cn("flex flex-col gap-px rounded-sm border-[1.2px] px-1 py-0.5", highlightTone[tone], className)} {...props} />;
}

function isTable(field: ExtractField | ExtractTable): field is ExtractTable {
  return "rows" in field;
}

function isChecked(field: ExtractField, resolved: Set<string>) {
  return field.status === "check" && !resolved.has(field.id);
}

function Divider({ vertical }: { vertical?: boolean }) {
  return <div role="separator" className={cn("shrink-0 bg-overlay-ink-8", vertical ? "w-px self-stretch" : "h-px self-stretch")} />;
}

function stepClass() {
  return "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-primary motion-press hover:bg-overlay-ink-8 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-text-brand";
}

/**
 * Document extract panel (Paper `YUT-1` / `GWP-0`): a viewer with zoom controls on the left and the extracted
 * fields on the right, with Fields / JSON / Schema views, a per-row confirmation check and an Accept all footer.
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
        "@container flex w-full max-w-280 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col @4xl:flex-row">
        <div className="flex min-w-0 shrink-0 flex-col @4xl:w-135">
          <div className="flex items-center gap-2 py-3 pr-3 pl-3.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-overlay-ink-5 text-text-danger">
              <FilePdf aria-hidden className="size-4" />
            </span>
            <span className="min-w-0 truncate text-label-md text-text-primary">{fileName}</span>
            <CaretDown aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
            <span className="min-w-0 flex-1" />
            <span className="shrink-0 text-caption text-text-secondary">{pageLabel}</span>
            <div className="flex h-7.5 shrink-0 items-center gap-0.5 rounded-full bg-overlay-ink-5 px-1">
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
              className="flex h-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 pr-3.5 pl-3 text-label-sm text-text-primary motion-press hover:bg-overlay-ink-8 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              Fit
            </button>
          </div>
          <div className="flex min-h-120 flex-1 justify-center overflow-hidden bg-overlay-ink-7 px-6 py-5">
            <div
              className="flex h-fit w-117.5 shrink-0 origin-top flex-col gap-3.5 bg-bg-surface px-6.5 pt-6.5 pb-5 text-text-primary transition-[scale] duration-220 ease-out-quint [filter:drop-shadow(0_2px_4px_#00000014)]"
              style={{ scale: zoom / ZOOM_FIT }}
            >
              {sheet}
            </div>
          </div>
        </div>
        <Divider vertical />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 py-3 pr-3.5 pl-4">
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
              className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-overlay-ink-6 pr-3.5 pl-3 text-label-sm text-text-primary motion-press hover:bg-overlay-ink-8 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              <Scan aria-hidden className="size-3.5" />
              Extract
            </button>
          </div>
          <Divider />
          <div key={`${view}-${run}`} className="flex flex-col gap-1.5 pt-3.5 pr-4.5 pb-4 pl-4.5">
            {view === "fields" ? (
              <>
                <p className="text-body-sm text-text-secondary">{total} fields filled from this document</p>
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
                          <div key={field.id} className="motion-rise flex flex-col gap-1.5" style={delay}>
                            <div className="flex items-center gap-3">
                              <span className="w-25 shrink-0 text-body-sm text-text-secondary">{field.label}</span>
                              <span className="min-w-0 flex-1" />
                              {field.type ? <span className="w-14 shrink-0 text-end text-caption text-text-secondary">{field.type}</span> : null}
                            </div>
                            <div className="flex flex-col rounded-xl border border-overlay-ink-10 px-3 py-0.5">
                              <div className="flex items-center gap-2 py-2 text-caption text-text-secondary">
                                {field.columns.map((column) => (
                                  <span key={column.label} className={cn(column.width ? "shrink-0" : "min-w-0 flex-1", column.align === "end" && "text-end")} style={column.width ? { width: column.width } : undefined}>
                                    {column.label}
                                  </span>
                                ))}
                              </div>
                              {field.rows.map((row) => (
                                <div key={row.join("|")} className="flex items-center gap-2 py-2 text-caption text-text-primary">
                                  {row.map((cell, index) => {
                                    const column = field.columns[index];
                                    return (
                                      <span key={column?.label ?? cell} className={cn(column?.width ? "shrink-0" : "min-w-0 flex-1", column?.align === "end" && "text-end")} style={column?.width ? { width: column.width } : undefined}>
                                        {cell}
                                      </span>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      const needsCheck = isChecked(field, resolved);
                      return (
                        <div key={field.id} className="motion-rise flex items-center gap-3" style={delay}>
                          <span className="w-25 shrink-0 text-body-sm text-text-secondary">{field.label}</span>
                          <button
                            type="button"
                            disabled={!needsCheck}
                            onClick={() => resolve(field.id)}
                            aria-label={needsCheck ? `Confirm ${field.label}` : undefined}
                            className={cn(
                              "flex h-9 w-full min-w-0 max-w-75 items-center gap-2 rounded-[10px] border px-3 text-start motion-colors",
                              needsCheck
                                ? "cursor-pointer border-red-500/90 bg-overlay-ink-12 hover:bg-overlay-ink-14 focus-visible:outline-2 focus-visible:outline-text-brand"
                                : "cursor-default border-transparent bg-overlay-ink-4",
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">{field.value}</span>
                            {needsCheck ? (
                              <span className="shrink-0 text-caption text-text-danger">Check</span>
                            ) : (
                              <Check aria-hidden weight="bold" className="size-3.5 shrink-0 animate-pop-in text-text-secondary" />
                            )}
                          </button>
                          {field.type ? <span className="w-14 shrink-0 text-end text-caption text-text-secondary">{field.type}</span> : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : null}
            {view === "json" ? (
              <pre className="overflow-x-auto rounded-xl bg-overlay-ink-4 p-3 font-mono text-caption whitespace-pre text-text-primary">{json}</pre>
            ) : null}
            {view === "schema" ? (
              <ul className="flex flex-col gap-1.5">
                {flat.map((field) => (
                  <li key={field.id} className="flex items-center gap-3 text-body-sm text-text-primary">
                    <span className="w-35 shrink-0 text-text-secondary">{field.label}</span>
                    <span className="rounded-md bg-overlay-ink-6 px-1.5 py-px text-caption text-text-secondary">{field.type ?? "Text"}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-wrap items-center gap-3 py-3 pr-3.5 pl-4.5">
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
            <span className="flex size-5 items-center justify-center rounded-md bg-interactive-primary text-label-sm text-text-inverse">{bot.initial}</span>
            <span className="text-caption text-text-secondary">
              {bot.name}
              {bot.elapsed ? ` · ${bot.elapsed}` : ""}
            </span>
          </>
        ) : null}
        <button
          type="button"
          onClick={acceptAll}
          className="flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-interactive-primary pr-3.5 pl-3 text-label-sm text-text-inverse motion-press hover:bg-interactive-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
        >
          Accept all
        </button>
      </div>
    </section>
  );
}
