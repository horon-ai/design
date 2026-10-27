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
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";
import { IconButton } from "./icon-button";
import { Input } from "./input";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Figma `Data table` (192:9046): a solid surface card, 20px radius, 1px default border. */
export function DataTable({ className, ...props }: WithClass<ComponentProps<"div">>) {
  return (
    <div
      className={cn("flex flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface", className)}
      {...props}
    />
  );
}

export type DataTableHeaderProps = {
  /** 16px icon on the 26px brand tile. */
  icon?: ReactNode;
  title: ReactNode;
  /** Trailing 16px icon buttons. */
  actions?: ReactNode;
  className?: string;
};

export function DataTableHeader({ icon, title, actions, className }: DataTableHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 px-6 py-4.5", className)}>
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

export function DataTableTable({ className, ...props }: WithClass<ComponentProps<"table">>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-left", className)} {...props} />
    </div>
  );
}

/** Header cell: 52px, 14px icon and label-md secondary text. */
export function DataTableHead({
  icon,
  className,
  children,
  ...props
}: WithClass<ComponentProps<"th">> & { icon?: ReactNode }) {
  return (
    <th
      className={cn(
        "font-normal h-13 border-y border-border-default pr-3 align-middle first:pl-6 last:pr-6 [&_svg]:size-3.5",
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

export function DataTableRow({ className, ...props }: WithClass<ComponentProps<"tr">>) {
  return <tr className={cn("border-b border-border-default", className)} {...props} />;
}

/** Body cell: 52px; body-sm secondary text unless the content sets its own. */
export function DataTableCell({ className, ...props }: WithClass<ComponentProps<"td">>) {
  return (
    <td
      className={cn(
        "h-13 pr-3 align-middle text-body-sm whitespace-nowrap text-text-secondary first:pl-6 last:pr-6 [&>label]:flex",
        className,
      )}
      {...props}
    />
  );
}

/** The 24px ink logo tile with a label-sm initial, beside a label-lg name. */
export function DataTableItem({ logo, children }: { logo: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-ink text-label-sm text-text-on-ink">
        {logo}
      </span>
      <span className="truncate text-label-lg text-text-primary">{children}</span>
    </span>
  );
}

/** Figma `Table tag`: brand (sky tint) or neutral (subtle) label, 8px radius. */
export function DataTableTag({
  tone = "brand",
  className,
  ...props
}: WithClass<ComponentProps<"span">> & { tone?: "brand" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm px-2.5 py-[3px] text-label-md whitespace-nowrap",
        tone === "brand" ? "bg-bg-brand text-text-brand" : "bg-bg-subtle text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export type DataTableFooterProps = { onAdd?: () => void; addLabel?: string; hint?: ReactNode; className?: string };

/** Footer: "Add row" with a 16px plus and a caption hint on the right. */
export function DataTableFooter({ onAdd, addLabel = "Add row", hint, className }: DataTableFooterProps) {
  return (
    <div className={cn("flex items-center gap-2 px-6 pt-3.5 pb-4", className)}>
      <button
        type="button"
        onClick={onAdd}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-label-md text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand"
      >
        <Plus aria-hidden className="size-4" />
        {addLabel}
      </button>
      {hint && <span className="shrink-0 text-caption text-text-secondary">{hint}</span>}
    </div>
  );
}

export type DataTableColumnMeta = {
  /** 14px icon before the header label. */
  icon?: ReactNode;
  headClassName?: string;
  cellClassName?: string;
};

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

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;

export type UseDataTableOptions<TData extends RowData> = {
  data: TData[];
  columns: DataTableColumn<TData>[];
  getRowId?: (row: TData, index: number) => string;
  /** Rows per page. Omit it to show every row on one page. */
  pageSize?: number;
  enableRowSelection?: boolean;
};

/** Builds the TanStack table behind `DataTableView`, `DataTableSearch` and `DataTablePagination`. */
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

/** Leading checkbox column; the header box selects every row on the current page. */
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

export type DataTableViewProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  emptyMessage?: ReactNode;
  className?: string;
};

/** Renders a `useDataTable` instance with the Figma head and body cells; sortable heads toggle on click. */
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
                      {sorted === "asc" ? (
                        <CaretUp aria-hidden />
                      ) : sorted === "desc" ? (
                        <CaretDown aria-hidden />
                      ) : (
                        <CaretUpDown aria-hidden className="opacity-60" />
                      )}
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
          rows.map((row) => (
            <DataTableRow key={row.id} data-selected={row.getIsSelected() ? "" : undefined}>
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

export type DataTableSearchProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  placeholder?: string;
  className?: string;
};

/** Solid search field bound to the table's global filter. */
export function DataTableSearch<TData extends RowData>({
  table,
  placeholder = "Search",
  className,
}: DataTableSearchProps<TData>) {
  return (
    <Input
      surface="solid"
      icon={<MagnifyingGlass />}
      placeholder={placeholder}
      aria-label={placeholder}
      value={String(table.state.globalFilter ?? "")}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className={cn("h-8 min-w-0", className)}
    />
  );
}

export type DataTablePaginationProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  className?: string;
};

/** Row count (or selection count) with previous and next page buttons. */
export function DataTablePagination<TData extends RowData>({ table, className }: DataTablePaginationProps<TData>) {
  const total = table.getFilteredRowModel().rows.length;
  const selected = table.getFilteredSelectedRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className={cn("flex items-center justify-between gap-4 px-6 py-3", className)}>
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
