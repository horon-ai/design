import { CaretDown, CaretLeft, CaretRight, CaretUp, CaretUpDown, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

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
 * Figma `Data table`: a solid surface card, 20px radius, 1px default border.
 * `device` sets the gutters: 24px on desktop and tablet, 18px on mobile (where the table scrolls sideways).
 *
 * The card is the context every part reads: it publishes `data-device`, which the header, cells and footer
 * use to switch their padding, and `group/dt`, so the parts can be laid out in any order inside it.
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
  ...props
}: WithClass<ComponentProps<"div">> & {
  /** Viewport the table is designed for. @default "desktop" */
  device?: DataTableDevice;
}) {
  return (
    <div
      data-device={device}
      className={cn(
        "group/dt flex min-w-0 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    />
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
  return (
    <div className={cn("flex items-center gap-3 px-6 py-4.5 group-data-[device=mobile]/dt:px-4.5", className)}>
      {icon && (
        <span className="flex size-6.5 shrink-0 items-center justify-center rounded-[7px] bg-bg-brand text-text-brand [&>svg]:size-4">
          {icon}
        </span>
      )}
      <h3 className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</h3>
      {actions && (
        <div className="-my-1.5 flex shrink-0 items-center gap-3 text-text-secondary [&_svg]:size-4">{actions}</div>
      )}
    </div>
  );
}

/**
 * The scroll container and the `<table>` inside it, with collapsed borders.
 *
 * Part of {@link DataTable}. On `device="mobile"` the table switches to its min-content width so the
 * wrapper scrolls sideways instead of squeezing columns; above that it fills the card.
 */
export function DataTableTable({ className, ...props }: WithClass<ComponentProps<"table">>) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-left group-data-[device=mobile]/dt:min-w-max", className)}
        {...props}
      />
    </div>
  );
}

/**
 * Header cell: 52px, 14px icon and label-md secondary text.
 *
 * Part of {@link DataTable}. It draws the top and bottom hairlines and 24px outer gutters (18px on mobile);
 * `DataTableView` passes `aria-sort` here for a sortable column, which is why it stays a plain `<th>`.
 */
export function DataTableHead({
  icon,
  className,
  children,
  ...props
}: WithClass<ComponentProps<"th">> & {
  /** 14px icon before the label, rendered inside the cell's inline label row. */
  icon?: ReactNode;
}) {
  return (
    <th
      className={cn(
        "font-normal h-13 border-y border-border-default pr-3 align-middle first:pl-6 group-data-[device=mobile]/dt:first:pl-4.5 last:pr-6 group-data-[device=mobile]/dt:last:pr-4.5 [&_svg]:size-3.5",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2 text-label-md whitespace-nowrap text-text-secondary">
        {icon}
        {children}
      </span>
    </th>
  );
}

/** Body row: one bottom hairline; `DataTableView` adds the hover, selected and staggered rise classes. */
export function DataTableRow({ className, ...props }: WithClass<ComponentProps<"tr">>) {
  return <tr className={cn("border-b border-border-default", className)} {...props} />;
}

/**
 * Body cell: 52px; body-sm secondary text unless the content sets its own.
 *
 * Part of {@link DataTable}. It keeps text on one line, uses the same 24/18px outer gutters as the head,
 * and turns a direct `<label>` into a flex box so a checkbox and its text line up in the cell.
 */
export function DataTableCell({ className, ...props }: WithClass<ComponentProps<"td">>) {
  return (
    <td
      className={cn(
        "h-13 pr-3 align-middle text-body-sm whitespace-nowrap text-text-secondary first:pl-6 group-data-[device=mobile]/dt:first:pl-4.5 last:pr-6 group-data-[device=mobile]/dt:last:pr-4.5 [&>label]:flex",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The 24px ink logo tile with a label-sm initial, beside a label-lg name. Part of {@link DataTable}.
 *
 * prettier-ignore keeps the parameter pattern identical to the original instead of letting the formatter
 * expand the destructured parameter onto separate lines.
 */
// prettier-ignore
export function DataTableItem({ logo, children }: {
  /** Tile content: a letter, or an icon the caller sizes (the tile is 24px square). */
  logo: ReactNode;
  /** The row's name, `label-lg` primary text truncated to the cell. */
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-ink text-label-sm text-text-on-ink">
        {logo}
      </span>
      <span className="truncate text-label-lg text-text-primary">{children}</span>
    </span>
  );
}

/**
 * Figma `Table tag`: brand (sky tint) or neutral (subtle) label, 8px radius.
 * Part of {@link DataTable}; it renders a non-interactive `span` so it fits inside a cell's text flow.
 */
export function DataTableTag({
  tone = "brand",
  className,
  ...props
}: WithClass<ComponentProps<"span">> & {
  /** `brand` is the sky tint with brand text; `neutral` is the subtle fill with secondary text. @default "brand" */
  tone?: "brand" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6.5 items-center rounded-sm px-2.5 text-label-md whitespace-nowrap",
        tone === "brand" ? "bg-bg-brand text-text-brand" : "bg-bg-subtle text-text-secondary",
        className,
      )}
      {...props}
    />
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
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 px-6 pt-3.5 pb-4 group-data-[device=mobile]/dt:px-4.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={onAdd}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-label-md text-text-secondary motion-colors focus-visible:outline-2 focus-visible:outline-text-brand"
      >
        <Plus aria-hidden className="size-4" />
        {addLabel}
      </button>
      {hint && <span className="shrink-0 text-caption text-text-secondary">{hint}</span>}
    </div>
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

/** Empty meta object that gives `columnMeta` its type, so `meta` in a column def is checked against the shape above. */
const columnMeta: DataTableColumnMeta = {};

/** TanStack Table features every horon data table registers: sorting, filtering, selection, pagination. */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, datetime: sortFn_datetime, text: sortFn_text },
  filterFns: { includesString: filterFn_includesString },
  columnMeta,
});

/** The feature set `dataTableFeatures` builds; the type every column and table instance is parameterised by. */
export type DataTableFeatures = typeof dataTableFeatures;

/**
 * A column definition bound to the horon feature set and to the row type.
 * @typeParam TData - Shape of one row; derive it from the data array so `accessorKey` stays checked.
 */
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;

/**
 * The table instance `useDataTable` returns; pass it to {@link DataTableView}, {@link DataTableSearch} and {@link DataTablePagination}.
 * @typeParam TData - Shape of one row, the same one the columns were built from.
 */
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;

/**
 * Options for {@link useDataTable}.
 * @typeParam TData - Shape of one row.
 */
export type UseDataTableOptions<TData extends RowData> = {
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
 * Builds the TanStack table behind `DataTableView`, `DataTableSearch` and `DataTablePagination`.
 *
 * Registers {@link dataTableFeatures} and starts on page 1 with the given `pageSize` (10 by default in
 * state). Without `pageSize` it turns on manual pagination, so the paginated row model is skipped and every
 * row renders.
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
export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  pageSize,
  enableRowSelection = false,
}: UseDataTableOptions<TData>): DataTableInstance<TData> {
  return useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    enableRowSelection,
    manualPagination: pageSize === undefined,
    initialState: { pagination: { pageIndex: 0, pageSize: pageSize ?? 10 } },
  });
}

/**
 * Leading checkbox column; the header box selects every row on the current page.
 *
 * Part of the {@link DataTable} set. The header box reports indeterminate when only some page rows are
 * selected, each cell box is labelled "Select row <n>" and is disabled when the table does not allow
 * selecting that row, and the column is pinned 48px wide and unsortable.
 *
 * @typeParam TData - Shape of one row.
 * @returns A column definition to put first in the `columns` array; it reads the table's own selection state.
 */
export function dataTableSelectColumn<TData extends RowData>(): DataTableColumn<TData> {
  return {
    id: "select",
    enableSorting: false,
    meta: { headClassName: "w-12" },
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected();
      return (
        <Checkbox
          size="sm"
          aria-label="Select all rows"
          checked={all}
          indeterminate={!all && table.getIsSomePageRowsSelected()}
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        size="sm"
        aria-label={`Select row ${row.index + 1}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  };
}

const ariaSort = { asc: "ascending", desc: "descending" } as const;

/**
 * Props for {@link DataTableView}.
 * @typeParam TData - Shape of one row.
 */
export type DataTableViewProps<TData extends RowData> = {
  /** Instance from {@link useDataTable}. */
  table: DataTableInstance<TData>;
  /** Cell shown when the filtered rows are empty. @default "No results." */
  emptyMessage?: ReactNode;
  /** Extra classes on the `<table>`. */
  className?: string;
};

/**
 * Renders a `useDataTable` instance with the Figma head and body cells; sortable heads toggle on click.
 *
 * A sortable head is a button with a three-state caret (none, ascending, descending) and sets `aria-sort` on
 * the `<th>`; a non-sortable head shows the column's `meta.icon` instead. Rows rise in 30ms apart, hover with
 * a 4% ink wash, and a selected row keeps the wash on its cells. A sort or page change remounts the
 * body so the stagger replays. An empty row model renders one full-width cell with `emptyMessage`.
 *
 * @typeParam TData - Shape of one row, matching the instance.
 */
export function DataTableView<TData extends RowData>({
  table,
  emptyMessage = "No results.",
  className,
}: DataTableViewProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <DataTableTable className={className}>
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => {
              const meta = header.column.columnDef.meta;
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted();

              return (
                <DataTableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  icon={canSort ? undefined : meta?.icon}
                  aria-sort={canSort ? (sorted ? ariaSort[sorted] : "none") : undefined}
                  className={meta?.headClassName}
                >
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className="-mx-1 flex cursor-pointer items-center gap-2 rounded-xs px-1 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
                    >
                      {meta?.icon}
                      <table.FlexRender header={header} />
                      <span key={sorted || "none"} className="flex animate-fade-in">
                        {sorted === "asc" ? (
                          <CaretUp aria-hidden />
                        ) : sorted === "desc" ? (
                          <CaretDown aria-hidden />
                        ) : (
                          <CaretUpDown aria-hidden className="opacity-60" />
                        )}
                      </span>
                    </button>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </DataTableHead>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <DataTableRow>
            <DataTableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center">
              {emptyMessage}
            </DataTableCell>
          </DataTableRow>
        ) : (
          rows.map((row, index) => (
            <DataTableRow
              key={`${table.state.pagination.pageIndex}:${table.state.sorting
                .map((sort) => `${sort.id}${sort.desc ? "d" : "a"}`)
                .join()}:${row.id}`}
              className="motion-rise motion-colors hover:bg-overlay-ink-4 data-selected:[&>td]:bg-overlay-ink-4 data-selected:hover:[&>td]:bg-overlay-ink-6"
              style={{ "--i": index, animationDelay: "calc(var(--i) * 30ms)" } as CSSProperties}
              data-selected={row.getIsSelected() ? "" : undefined}
            >
              {row.getAllCells().map((cell) => (
                <DataTableCell key={cell.id} className={cell.column.columnDef.meta?.cellClassName}>
                  <table.FlexRender cell={cell} />
                </DataTableCell>
              ))}
            </DataTableRow>
          ))
        )}
      </tbody>
    </DataTableTable>
  );
}

/**
 * Props for {@link DataTableSearch}.
 * @typeParam TData - Shape of one row.
 */
export type DataTableSearchProps<TData extends RowData> = {
  /** Instance from {@link useDataTable}. */
  table: DataTableInstance<TData>;
  /** Field placeholder; it is also the `aria-label`. @default "Search" */
  placeholder?: string;
  /** Extra classes on the input, merged after `min-w-0`. */
  className?: string;
};

/**
 * Solid search field bound to the table's global filter.
 * Part of the {@link DataTable} set: it is a small `Input` with a magnifier, writes every keystroke into the
 * table's global filter and reads the current value back from the table state, so it stays in sync when
 * something else clears the filter.
 *
 * @typeParam TData - Shape of one row.
 */
export function DataTableSearch<TData extends RowData>({
  table,
  placeholder = "Search",
  className,
}: DataTableSearchProps<TData>) {
  return (
    <Input
      surface="solid"
      size="sm"
      icon={<MagnifyingGlass />}
      placeholder={placeholder}
      aria-label={placeholder}
      value={String(table.state.globalFilter ?? "")}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className={cn("min-w-0", className)}
    />
  );
}

/**
 * Props for {@link DataTablePagination}.
 * @typeParam TData - Shape of one row.
 */
export type DataTablePaginationProps<TData extends RowData> = {
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
export function DataTablePagination<TData extends RowData>({ table, className }: DataTablePaginationProps<TData>) {
  const total = table.getFilteredRowModel().rows.length;
  const selected = table.getFilteredSelectedRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3 group-data-[device=mobile]/dt:px-4.5",
        className,
      )}
    >
      <p className="text-caption text-text-secondary tabular-nums">
        {selected > 0 ? `${selected} of ${total} selected` : `${total} ${total === 1 ? "row" : "rows"}`}
      </p>
      <div className="flex items-center gap-2">
        <IconButton
          size="sm"
          icon={<CaretLeft />}
          label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <span className="text-caption text-text-secondary tabular-nums">
          Page {table.state.pagination.pageIndex + 1} of {pageCount}
        </span>
        <IconButton
          size="sm"
          icon={<CaretRight />}
          label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>
    </div>
  );
}
