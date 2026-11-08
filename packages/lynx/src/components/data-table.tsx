import { createContext, useContext, useMemo, useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";
import { IconButton } from "./icon-button";
import { Input } from "./input";

/** Strips an element's own `className` so a wrapper can merge its classes with the caller's. */
type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged last onto the element, after the component's own classes. */
  className?: string;
};

/** Viewport the table is designed for: `desktop` and `tablet` keep 24px card gutters, `mobile` narrows them to 18px. */
export type DataTableDevice = "desktop" | "tablet" | "mobile";

/**
 * The device the enclosing {@link DataTable} publishes. React put `data-device` on the card and let
 * `group-data-[device=mobile]/dt` switch every part's gutters; Lynx has no ancestor selectors, so the
 * card publishes the value through this context and the parts pick their padding from it.
 */
const DataTableDeviceContext = createContext<DataTableDevice>("desktop");

/** True for a slot the component can wrap in its own `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The Figma spring (`--ease-spring`), written out because an inline style cannot read a variable. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Figma `Data table`: a solid surface card, 20px radius, 1px default border.
 * `device` sets the gutters: 24px on desktop and tablet, 18px on mobile (where the table scrolls sideways).
 *
 * The card is the context every part reads: in react that was the `data-device` attribute the header, cells
 * and footer switched their padding on; Lynx has no ancestor selectors, so the card publishes `device`
 * through a context instead, and the parts can still be laid out in any order inside it.
 *
 * @example
 * ```tsx
 * function BotsTable({ bots }: { bots: { id: string; name: string; owner: string }[] }) {
 *   const table = useDataTable({
 *     data: bots,
 *     columns: [
 *       { accessorKey: "name", header: "Name" },
 *       { accessorKey: "owner", header: "Owner" },
 *     ],
 *     pageSize: 10,
 *   });
 *
 *   return (
 *     <DataTable>
 *       <DataTableView table={table} />
 *       <DataTablePagination table={table} />
 *     </DataTable>
 *   );
 * }
 * ```
 */
export function DataTable({
  device = "desktop",
  className,
  children,
}: WithClass<{ children?: ReactNode }> & {
  /** Viewport the table is designed for. @default "desktop" */
  device?: DataTableDevice;
}) {
  return (
    <DataTableDeviceContext.Provider value={device}>
      <view
        className={cn(
          "flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface",
          className,
        )}
      >
        {children}
      </view>
    </DataTableDeviceContext.Provider>
  );
}

/** Props for {@link DataTableHeader}: an optional leading icon, the heading and trailing actions. */
export type DataTableHeaderProps = {
  /** 16px icon on the 26px brand tile. */
  icon?: ReactNode;
  /** Card heading, `label-lg` primary text on one truncated line. */
  title: ReactNode;
  /** Trailing 16px icon buttons. */
  actions?: ReactNode;
  /** Extra classes on the header row, merged after the padding classes. */
  className?: string;
};

/**
 * The card's top row: leading icon tile, title and trailing actions, 24px gutters (18px on mobile).
 *
 * Part of {@link DataTable}. The actions column is `text-secondary` with 16px icons and pulls 6px into the
 * header's vertical padding, so an icon button keeps its own footprint without inflating the row.
 */
export function DataTableHeader({ icon, title, actions, className }: DataTableHeaderProps) {
  const device = useContext(DataTableDeviceContext);

  return (
    <view
      className={cn(
        "flex flex-row items-center gap-3 py-[18px]",
        device === "mobile" ? "px-[18px]" : "px-6",
        className,
      )}
    >
      {icon ? (
        <view className="flex size-[26px] shrink-0 flex-row items-center justify-center rounded-[7px] bg-bg-brand">
          {icon}
        </view>
      ) : null}
      {isPlainText(title) ? (
        <text className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</text>
      ) : (
        <view className="min-w-0 flex-1">{title}</view>
      )}
      {actions ? <view className="flex shrink-0 flex-row items-center gap-3">{actions}</view> : null}
    </view>
  );
}

/**
 * The sideways scroll container and the column of rows inside it.
 *
 * Part of {@link DataTable}. React's `<table>` used collapsed borders and an `overflow-x-auto` wrapper;
 * Lynx has no table element, so the parts are flex lines inside a `<scroll-view>`. The inner column keeps
 * a minimum width, which is what makes a narrow card scroll sideways instead of squeezing the columns.
 */
export function DataTableTable({ className, children }: WithClass<{ children?: ReactNode }>) {
  const device = useContext(DataTableDeviceContext);

  return (
    <scroll-view scroll-orientation="horizontal" className="w-full min-w-0 max-w-full">
      <view className={cn("flex w-full flex-col", device === "mobile" ? "min-w-[420px]" : "min-w-[520px]", className)}>
        {children}
      </view>
    </scroll-view>
  );
}

/** Props of {@link DataTableHead}: the leading icon, the sort state and the tap that toggles it. */
type DataTableHeadProps = WithClass<{ children?: ReactNode }> & {
  /** 14px icon before the label. */
  icon?: ReactNode;
  /** Called when the head is tapped; a sortable column passes its own toggle here. */
  onTap?: () => void;
  /**
   * The column's sort state, which draws the three-state caret: `asc` up, `desc` down, `none` the
   * up-down caret at 60%. Omit it for a column that does not sort.
   */
  sorted?: "asc" | "desc" | "none";
};

/**
 * Header cell: 52px, 14px icon and label-md secondary text.
 *
 * Part of {@link DataTable}. It draws the top and bottom hairlines and 24px outer gutters (18px on
 * mobile). React made a sortable head a `<button>` inside the cell and set `aria-sort` on the `<th>`;
 * Lynx cells have no sort attribute, so the whole cell is the tap target and reports itself as a
 * `columnheader` button while `sorted` is set, and the caret lives beside the label.
 */
export function DataTableHead({ icon, className, children, onTap, sorted }: DataTableHeadProps) {
  return (
    <view
      className={cn("flex h-[52px] min-w-0 flex-row items-center border-y border-border-default pr-3", className)}
      bindtap={onTap}
      accessibility-element={onTap ? true : undefined}
      accessibility-role-description={onTap ? "columnheader" : undefined}
      accessibility-traits={onTap ? "button" : undefined}
      accessibility-value={sorted === undefined ? undefined : sorted}
    >
      <view className="flex min-w-0 flex-row items-center gap-2">
        {icon}
        {isPlainText(children) ? (
          <text className="whitespace-nowrap text-label-md text-text-secondary">{children}</text>
        ) : (
          children
        )}
        {sorted ? (
          <view
            className={cn("flex shrink-0 flex-row items-center", sorted === "none" && "opacity-60")}
            style={
              sorted === "none"
                ? undefined
                : {
                    animationName: "fade-in",
                    animationDuration: "160ms",
                    animationTimingFunction: EASE_OUT_QUINT,
                    animationFillMode: "both",
                  }
            }
          >
            <Icon
              name={sorted === "asc" ? "CaretUp" : sorted === "desc" ? "CaretDown" : "CaretUpDown"}
              size={14}
              color="text-secondary"
            />
          </view>
        ) : null}
      </view>
    </view>
  );
}

/** Body row: one bottom hairline; `DataTableView` adds the selected wash and the staggered rise. */
export function DataTableRow({
  className,
  children,
  style,
}: WithClass<{ children?: ReactNode; style?: Record<string, string | number> }>) {
  return (
    <view className={cn("flex flex-row items-center border-b border-border-default", className)} style={style}>
      {children}
    </view>
  );
}

/**
 * Body cell: 52px; body-sm secondary text unless the content sets its own.
 *
 * Part of {@link DataTable}. It keeps text on one line and takes the same 24/18px outer gutters as the
 * head; react turned a direct `<label>` into a flex box, which Lynx does not need because a cell is
 * already a row of its own.
 */
export function DataTableCell({ className, children }: WithClass<{ children?: ReactNode }>) {
  return <view className={cn("flex h-[52px] min-w-0 flex-row items-center pr-3", className)}>{children}</view>;
}

/**
 * The 24px ink logo tile with a label-sm initial, beside a label-lg name. Part of {@link DataTable}.
 */
export function DataTableItem({
  logo,
  children,
}: {
  /** Tile content: a letter, or an icon the caller sizes (the tile is 24px square). */
  logo: ReactNode;
  /** The row's name, `label-lg` primary text truncated to the cell. */
  children: ReactNode;
}) {
  return (
    <view className="flex min-w-0 flex-row items-center gap-2.5">
      <view className="flex size-6 shrink-0 flex-row items-center justify-center rounded-xs bg-surface-ink">
        {isPlainText(logo) ? <text className="text-label-sm text-text-on-ink">{logo}</text> : logo}
      </view>
      {isPlainText(children) ? (
        <text className="min-w-0 truncate text-label-lg text-text-primary">{children}</text>
      ) : (
        <view className="min-w-0 flex-1">{children}</view>
      )}
    </view>
  );
}

/**
 * Figma `Table tag`: brand (sky tint) or neutral (subtle) label, 8px radius.
 * Part of {@link DataTable}; it renders a non-interactive view, so it fits inside a cell's content.
 */
export function DataTableTag({
  tone = "brand",
  className,
  children,
}: WithClass<{ children?: ReactNode }> & {
  /** `brand` is the sky tint with brand text; `neutral` is the subtle fill with secondary text. @default "brand" */
  tone?: "brand" | "neutral";
}) {
  return (
    <view
      className={cn(
        "flex h-[26px] shrink-0 flex-row items-center rounded-sm px-2.5",
        tone === "brand" ? "bg-bg-brand text-text-brand" : "bg-bg-subtle text-text-secondary",
        className,
      )}
    >
      {isPlainText(children) ? (
        <text
          className={cn(
            "whitespace-nowrap text-label-md",
            tone === "brand" ? "text-text-brand" : "text-text-secondary",
          )}
        >
          {children}
        </text>
      ) : (
        children
      )}
    </view>
  );
}

/** Props for {@link DataTableFooter}: the add-row action and an optional caption hint. */
export type DataTableFooterProps = {
  /** Fires when the add-row row is pressed; the footer itself adds nothing. */
  onAdd?: () => void;
  /** Text of the add action, `label-md` secondary. @default "Add row" */
  addLabel?: string;
  /** Caption at the right edge, such as a total or a keyboard hint. */
  hint?: ReactNode;
  /** Extra classes on the footer row, merged after the padding classes. */
  className?: string;
};

/**
 * Footer: "Add row" with a 16px plus and a caption hint on the right.
 * Part of {@link DataTable}. The add action takes the free width, so the hint stays pinned right; both wrap onto a second line when narrow.
 */
export function DataTableFooter({ onAdd, addLabel = "Add row", hint, className }: DataTableFooterProps) {
  const device = useContext(DataTableDeviceContext);

  return (
    <view
      className={cn(
        "flex flex-row flex-wrap items-center gap-x-2 gap-y-1 pb-4 pt-3.5",
        device === "mobile" ? "px-[18px]" : "px-6",
        className,
      )}
    >
      <view
        className="flex min-w-0 flex-1 flex-row items-center gap-2"
        bindtap={onAdd}
        accessibility-element={onAdd ? true : undefined}
        accessibility-traits={onAdd ? "button" : undefined}
        accessibility-label={addLabel}
      >
        <Icon name="Plus" size={16} color="text-secondary" />
        <text className="text-label-md text-text-secondary">{addLabel}</text>
      </view>
      {hint ? (
        isPlainText(hint) ? (
          <text className="shrink-0 text-caption text-text-secondary">{hint}</text>
        ) : (
          <view className="shrink-0">{hint}</view>
        )
      ) : null}
    </view>
  );
}

/** The `meta` a horon column can carry; `DataTableView` reads it for the head icon and the two class hooks. */
export type DataTableColumnMeta = {
  /** 14px icon before the header label. */
  icon?: ReactNode;
  /** Extra classes on this column's header cell, such as a width. */
  headClassName?: string;
  /** Extra classes on each body cell of this column. */
  cellClassName?: string;
};

/**
 * The table features every horon data table supports: sorting, filtering, selection and pagination.
 *
 * React exported the object `tableFeatures(...)` built, which bound TanStack's row models; Lynx
 * implements those four features in this file instead, so the export is the plain list of what a
 * {@link DataTableColumn} may rely on.
 */
export const dataTableFeatures = { sorting: true, filtering: true, selection: true, pagination: true } as const;

/** The feature set `dataTableFeatures` describes; the type every column and table instance is parameterised by. */
export type DataTableFeatures = typeof dataTableFeatures;

/**
 * One row of a built table: the row object, where it sat in the data, and its selection state.
 * Internal to this file; react's rows were TanStack's and are not part of the public surface.
 */
type Row<TData> = {
  /** Stable id, from the table's `getRowId` or the row's index. */
  id: string;
  /** Position in the original data array. */
  index: number;
  /** The row object as given. */
  original: TData;
  /** Whether the row is selected now. */
  selected: boolean;
  /** Whether the table allows selecting this row. */
  canSelect: boolean;
  /** Selects or clears this row; a row that cannot be selected ignores it. */
  toggleSelected: (next?: boolean) => void;
};

/**
 * A column definition bound to the horon feature set and to the row type.
 * @typeParam TData - Shape of one row; derive it from the data array so `accessorKey` stays checked.
 */
export type DataTableColumn<TData> = {
  /** Stable column id; defaults to `accessorKey`, then to the column's position. */
  id?: string;
  /** Row field this column reads, sorts and filters on. A column without one does not sort. */
  accessorKey?: keyof TData & string;
  /** Header label, or a render function for a header that needs the table (the selection box does). */
  header?: ReactNode | ((context: { table: DataTableInstance<TData> }) => ReactNode);
  /** Cell content; without it the value at `accessorKey` is printed as body-sm secondary text. */
  cell?: (context: { row: Row<TData>; value: unknown; table: DataTableInstance<TData> }) => ReactNode;
  /** `false` drops the sort caret and the tap target. Defaults to sortable whenever the column has an `accessorKey`. */
  enableSorting?: boolean;
  /** Icon and per-column class hooks; see {@link DataTableColumnMeta}. */
  meta?: DataTableColumnMeta;
};

/**
 * The table instance `useDataTable` returns; pass it to {@link DataTableView}, {@link DataTableSearch} and {@link DataTablePagination}.
 * @typeParam TData - Shape of one row, the same one the columns were built from.
 */
export type DataTableInstance<TData> = {
  /** The columns as given, in display order. */
  columns: DataTableColumn<TData>[];
  /** Every row that survives the global filter, in data order. */
  rows: Row<TData>[];
  /** The rows of the current page, after sorting. */
  pageRows: Row<TData>[];
  /** The active sorting, in react's `state.sorting` shape: one entry while a column is sorted. */
  sort: { id: string; desc: boolean }[];
  /** Index of the current page, zero-based. */
  pageIndex: number;
  /** Number of pages, never below one. */
  pageCount: number;
  /** The current filter string. */
  globalFilter: string;
  /** Filtered row count, the number the footer and pagination report. */
  totalRows: number;
  /** Filtered rows that are selected. */
  selectedCount: number;
  /** True when every row on this page is selected and the page is not empty. */
  allPageSelected: boolean;
  /** True when some, but not all, rows on this page are selected. */
  somePageSelected: boolean;
  /** True while a previous page exists. */
  canPreviousPage: boolean;
  /** True while a next page exists. */
  canNextPage: boolean;
  /** Whether the table allows selection at all. */
  enableRowSelection: boolean;
  /** Cycles a sortable column: unsorted → ascending → descending → unsorted. */
  toggleSort: (columnId: string) => void;
  /** Replaces the global filter and returns to the first page. */
  setGlobalFilter: (value: string) => void;
  /** Selects or clears every row on the current page. */
  toggleAllPageRowsSelected: (checked: boolean) => void;
  /** Moves one page back; a no-op on the first page. */
  previousPage: () => void;
  /** Moves one page forward; a no-op on the last page. */
  nextPage: () => void;
};

/**
 * Options for {@link useDataTable}.
 * @typeParam TData - Shape of one row.
 */
export type UseDataTableOptions<TData> = {
  /** Rows to display; the table never mutates them. */
  data: TData[];
  /** Column definitions, in display order; see {@link DataTableColumn}. */
  columns: DataTableColumn<TData>[];
  /** Derives a stable row id from the row and its index; the default id is the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** Rows per page. Omit it to show every row on one page. */
  pageSize?: number;
  /** Makes every row selectable, which is what the checkbox column from {@link dataTableSelectColumn} toggles. @default false */
  enableRowSelection?: boolean;
};

/**
 * The flex share of one cell: a column that declares either class hook is pinned (`flex-none`) so its
 * width class fixes the column, and the rest share whatever is left.
 */
function columnFlex(meta: DataTableColumnMeta | undefined): string {
  return meta?.headClassName !== undefined || meta?.cellClassName !== undefined ? "flex-none" : "flex-1";
}

/** The column id the parts use for keys and sorting; `accessorKey` stands in when no explicit id is given. */
function columnId<TData>(column: DataTableColumn<TData>, index: number): string {
  return column.id ?? column.accessorKey ?? `column-${index}`;
}

/**
 * Orders two cell values the way react's default `sortFn_alphanumeric` did: numbers and dates compare
 * numerically, everything else as a case-insensitive string, with empty values first.
 */
function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  const left = sortText(a);
  const right = sortText(b);
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

/** Text a value sorts by when it is neither a number nor a date; an object falls back to its JSON. */
function sortText(value: unknown): string {
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === undefined || value === null) return "";
  return (JSON.stringify(value) ?? "").toLowerCase();
}

/**
 * Builds the table state behind `DataTableView`, `DataTableSearch` and `DataTablePagination`.
 *
 * React registered {@link dataTableFeatures} with TanStack and read the row models it built; Lynx keeps
 * the same four features in React state here, so the hook owns sorting, global filtering, selection and
 * pagination without a table library. Without `pageSize` every filtered row stays on one page, which is
 * react's `manualPagination` branch. The instance is a plain object rebuilt on each render; handing it to
 * the three parts is all the wiring there is.
 *
 * @typeParam TData - Shape of one row.
 * @param options - The table options; see {@link UseDataTableOptions}.
 * @param options.data - Rows to display.
 * @param options.columns - Column definitions, in display order.
 * @param options.getRowId - Derives a stable row id; the row index is used when omitted.
 * @param options.pageSize - Rows per page; omit it to show every row on one page.
 * @param options.enableRowSelection - Makes rows selectable for the checkbox column.
 * @returns A table instance to pass to the table parts.
 */
export function useDataTable<TData>({
  data,
  columns,
  getRowId,
  pageSize,
  enableRowSelection = false,
}: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const [sort, setSort] = useState<{ id: string; desc: boolean }[]>([]);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    const entries = data.map((row, index) => ({ row, index, id: getRowId?.(row, index) ?? String(index) }));
    if (query === "") return entries;
    return entries.filter(({ row }) =>
      columns.some((column) => {
        if (column.accessorKey === undefined) return false;
        const value = row[column.accessorKey];
        return String(value ?? "")
          .toLowerCase()
          .includes(query);
      }),
    );
  }, [columns, data, filter, getRowId]);

  const sorted = useMemo(() => {
    const active = sort[0];
    if (active === undefined) return filtered;
    const index = columns.findIndex((column, position) => columnId(column, position) === active.id);
    if (index < 0) return filtered;
    const key = columns[index].accessorKey;
    if (key === undefined) return filtered;
    const direction = active.desc ? -1 : 1;
    // oxlint-disable-next-line unicorn/no-array-sort -- toSorted is ES2023, missing on Lynx's ES2019 main thread; this sorts a fresh copy
    return filtered.slice().sort((left, right) => direction * compareValues(left.row[key], right.row[key]));
  }, [columns, filtered, sort]);

  const size = pageSize === undefined ? sorted.length : pageSize;
  const pageCount = size <= 0 ? 1 : Math.max(1, Math.ceil(sorted.length / size));
  const pageIndex = Math.min(page, pageCount - 1);
  const pageEntries = sorted.slice(pageIndex * size, pageIndex * size + size);

  const toRow = (entry: { row: TData; index: number; id: string }): Row<TData> => ({
    id: entry.id,
    index: entry.index,
    original: entry.row,
    selected: selection[entry.id] ?? false,
    canSelect: enableRowSelection,
    toggleSelected: (next) => {
      if (!enableRowSelection) return;
      const value = next ?? !selection[entry.id];
      setSelection((current) => (current[entry.id] === value ? current : { ...current, [entry.id]: value }));
    },
  });

  const rows = filtered.map(toRow);
  const pageRows = pageEntries.map(toRow);
  const selectedCount = rows.filter((row) => row.selected).length;
  const selectedOnPage = pageRows.filter((row) => row.selected).length;

  return {
    columns,
    rows,
    pageRows,
    sort,
    pageIndex,
    pageCount,
    globalFilter: filter,
    totalRows: rows.length,
    selectedCount,
    allPageSelected: pageRows.length > 0 && selectedOnPage === pageRows.length,
    somePageSelected: selectedOnPage > 0 && selectedOnPage < pageRows.length,
    canPreviousPage: pageIndex > 0,
    canNextPage: pageIndex < pageCount - 1,
    enableRowSelection,
    toggleSort: (id) =>
      setSort((current) => {
        const active = current[0];
        if (active === undefined || active.id !== id) return [{ id, desc: false }];
        if (!active.desc) return [{ id, desc: true }];
        return [];
      }),
    setGlobalFilter: (value) => {
      setFilter(value);
      setPage(0);
    },
    toggleAllPageRowsSelected: (checked) =>
      setSelection((current) => {
        const next = { ...current };
        for (const entry of pageEntries) next[entry.id] = checked;
        return next;
      }),
    previousPage: () => setPage((current) => Math.max(0, Math.min(current, pageCount - 1) - 1)),
    nextPage: () => setPage((current) => Math.min(pageCount - 1, current + 1)),
  };
}

/**
 * Leading checkbox column; the header box selects every row on the current page.
 *
 * Part of the {@link DataTable} set. The header box reports indeterminate when only some page rows are
 * selected, each cell box is labelled "Select row <n>" and is disabled when the table does not allow
 * selecting that row. The column is pinned 72px wide (48px plus the first cell's 24px gutter) and
 * unsortable; Lynx lays rows out as flex lines, so the width is declared on both class hooks.
 *
 * @typeParam TData - Shape of one row.
 * @returns A column definition to put first in the `columns` array; it reads the table's own selection state.
 */
export function dataTableSelectColumn<TData>(): DataTableColumn<TData> {
  return {
    id: "select",
    enableSorting: false,
    meta: { headClassName: "w-[72px]", cellClassName: "w-[72px]" },
    header: ({ table }) => (
      <Checkbox
        size="sm"
        aria-label="Select all rows"
        checked={table.allPageSelected}
        indeterminate={!table.allPageSelected && table.somePageSelected}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        size="sm"
        aria-label={`Select row ${row.index + 1}`}
        checked={row.selected}
        disabled={!row.canSelect}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  };
}

/**
 * Props for {@link DataTableView}.
 * @typeParam TData - Shape of one row.
 */
export type DataTableViewProps<TData> = {
  /** Instance from {@link useDataTable}. */
  table: DataTableInstance<TData>;
  /** Cell shown when the filtered rows are empty. @default "No results." */
  emptyMessage?: ReactNode;
  /** Extra classes on the row column. */
  className?: string;
};

/** Renders one cell: the column's own renderer, or its plain value as body-sm secondary text. */
function renderCell<TData>(
  column: DataTableColumn<TData>,
  row: Row<TData>,
  table: DataTableInstance<TData>,
): ReactNode {
  const value = column.accessorKey === undefined ? undefined : row.original[column.accessorKey];
  if (column.cell !== undefined) return column.cell({ row, value, table });
  if (value === undefined || value === null) return null;
  return <text className="min-w-0 truncate text-body-sm text-text-secondary">{String(value)}</text>;
}

/**
 * Renders a `useDataTable` instance with the Figma head and body cells; sortable heads toggle on click.
 *
 * A sortable head is a tap target with a three-state caret (none, ascending, descending); a non-sortable
 * head shows the column's `meta.icon` instead. Rows rise in 30ms apart and a selected row keeps a 4% ink
 * wash. A sort or page change re-keys the body so the stagger replays. An empty page renders one
 * full-width cell with `emptyMessage`.
 *
 * Lynx lays the rows out as flex lines, so a column that declares `meta.headClassName` or
 * `meta.cellClassName` is taken out of the fluid share (`flex-none`) and its width class pins it; give the
 * same width to both hooks so the head and its cells line up. Columns without either hook share the rest.
 *
 * @typeParam TData - Shape of one row, matching the instance.
 */
export function DataTableView<TData>({ table, emptyMessage = "No results.", className }: DataTableViewProps<TData>) {
  const device = useContext(DataTableDeviceContext);
  const start = device === "mobile" ? "pl-[18px]" : "pl-6";
  const end = device === "mobile" ? "pr-[18px]" : "pr-6";
  const lastIndex = table.columns.length - 1;
  const sortKey = table.sort.map((entry) => `${entry.id}${entry.desc ? "d" : "a"}`).join();

  return (
    <DataTableTable className={className}>
      <view className="flex flex-row items-stretch">
        {table.columns.map((column, index) => {
          const id = columnId(column, index);
          const meta = column.meta;
          const canSort = column.enableSorting !== false && column.accessorKey !== undefined;
          const active = table.sort.find((entry) => entry.id === id);
          const sorted: "asc" | "desc" | "none" = active === undefined ? "none" : active.desc ? "desc" : "asc";
          const header = typeof column.header === "function" ? column.header({ table }) : column.header;

          return (
            <DataTableHead
              key={id}
              icon={meta?.icon}
              sorted={canSort ? sorted : undefined}
              onTap={canSort ? () => table.toggleSort(id) : undefined}
              className={cn(columnFlex(meta), index === 0 && start, index === lastIndex && end, meta?.headClassName)}
            >
              {header}
            </DataTableHead>
          );
        })}
      </view>
      {table.pageRows.length === 0 ? (
        <DataTableRow>
          <DataTableCell className={cn("flex-1 items-center justify-center", start, end, "h-24")}>
            {isPlainText(emptyMessage) ? (
              <text className="text-center text-body-sm text-text-secondary">{emptyMessage}</text>
            ) : (
              emptyMessage
            )}
          </DataTableCell>
        </DataTableRow>
      ) : (
        table.pageRows.map((row, index) => (
          <DataTableRow
            key={`${table.pageIndex}:${sortKey}:${row.id}`}
            className={cn(
              "motion-rise motion-colors active:bg-overlay-ink-4",
              row.selected && "bg-overlay-ink-4 active:bg-overlay-ink-6",
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {table.columns.map((column, position) => (
              <DataTableCell
                key={columnId(column, position)}
                className={cn(
                  columnFlex(column.meta),
                  position === 0 && start,
                  position === lastIndex && end,
                  column.meta?.cellClassName,
                )}
              >
                {renderCell(column, row, table)}
              </DataTableCell>
            ))}
          </DataTableRow>
        ))
      )}
    </DataTableTable>
  );
}

/**
 * Props for {@link DataTableSearch}.
 * @typeParam TData - Shape of one row.
 */
export type DataTableSearchProps<TData> = {
  /** Instance from {@link useDataTable}. */
  table: DataTableInstance<TData>;
  /** Field placeholder; it is also the visible accessible name. @default "Search" */
  placeholder?: string;
  /** Extra classes on the input, merged after `min-w-0`. */
  className?: string;
};

/**
 * Solid search field bound to the table's global filter.
 * Part of the {@link DataTable} set: it is a small `Input` with a magnifier, writes every keystroke into the
 * table's global filter and reads the current value back from the table state, so it stays in sync when
 * something else clears the filter. React also set `aria-label` to the placeholder; Lynx's `<input>` takes
 * no such prop through this wrapper, so the placeholder is the only name the field carries.
 *
 * @typeParam TData - Shape of one row.
 */
export function DataTableSearch<TData>({ table, placeholder = "Search", className }: DataTableSearchProps<TData>) {
  return (
    <Input
      surface="solid"
      size="sm"
      icon={<Icon name="MagnifyingGlass" size={16} color="text-secondary" />}
      placeholder={placeholder}
      value={table.globalFilter}
      onChange={(value) => table.setGlobalFilter(value)}
      className={cn("min-w-0", className)}
    />
  );
}

/**
 * Props for {@link DataTablePagination}.
 * @typeParam TData - Shape of one row.
 */
export type DataTablePaginationProps<TData> = {
  /** Instance from {@link useDataTable}. */
  table: DataTableInstance<TData>;
  /** Extra classes on the row, merged after the padding classes. */
  className?: string;
};

/**
 * Row count (or selection count) with previous and next page buttons.
 *
 * Part of the {@link DataTable} set. With a selection it reads "n of m selected", otherwise "n rows"
 * (singular for one); the page label always shows at least one page, and each arrow is disabled at its end
 * of the range. The count follows the filtered rows, not the raw data.
 *
 * @typeParam TData - Shape of one row.
 */
export function DataTablePagination<TData>({ table, className }: DataTablePaginationProps<TData>) {
  const device = useContext(DataTableDeviceContext);
  const total = table.totalRows;
  const selected = table.selectedCount;
  const pageCount = Math.max(table.pageCount, 1);

  return (
    <view
      className={cn(
        "flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3",
        device === "mobile" ? "px-[18px]" : "px-6",
        className,
      )}
    >
      <text className="text-caption text-text-secondary">
        {selected > 0 ? `${selected} of ${total} selected` : `${total} ${total === 1 ? "row" : "rows"}`}
      </text>
      <view className="flex flex-row items-center gap-2">
        <IconButton
          size="sm"
          icon={<Icon name="CaretLeft" size={16} color="text-primary" />}
          label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.canPreviousPage}
        />
        <text className="text-caption text-text-secondary">{`Page ${table.pageIndex + 1} of ${pageCount}`}</text>
        <IconButton
          size="sm"
          icon={<Icon name="CaretRight" size={16} color="text-primary" />}
          label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.canNextPage}
        />
      </view>
    </view>
  );
}
