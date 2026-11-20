import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretUpDown,
  MagnifyingGlass,
  Plus,
} from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { HoronText } from "../lib/text";
import { Checkbox } from "./checkbox";
import { IconButton } from "./icon-button";
import { Input } from "./input";

/** Viewport the table is designed for: `desktop` and `tablet` keep 24px card gutters, `mobile` narrows them to 18px. */
export type DataTableDevice = "desktop" | "tablet" | "mobile";

/**
 * The device the enclosing {@link DataTable} publishes. React put `data-device` on the card and let
 * `group-data-[device=mobile]/dt` switch every part's gutters; React Native has no ancestor
 * selectors, so the card publishes the value through this context and the parts read their padding.
 */
const DeviceContext = createContext<DataTableDevice>("desktop");

/** Outside gutter of the card: 24pt on desktop and tablet, 18pt on mobile. */
const gutter = (device: DataTableDevice): number => (device === "mobile" ? 18 : spacing["6"]);

/** True for text a part can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** Row height of every head and body cell, `h-13`. */
const ROW = 52;

/**
 * Figma `Data table`: a solid surface card, 20px radius, 1px default border.
 * `device` sets the gutters: 24px on desktop and tablet, 18px on mobile (where the table scrolls sideways).
 *
 * The card publishes its `device` through a context, which the header, cells and footer read for
 * their padding, so the parts can be laid out in any order inside it.
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
  style,
  children,
}: {
  /** Viewport the table is designed for. @default "desktop" */
  device?: DataTableDevice;
  /** Layout merged onto the card (width, margins). */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const theme = useHoronTheme();
  return (
    <DeviceContext.Provider value={device}>
      <View
        style={[
          styles.card,
          { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
          style,
        ]}
      >
        {children}
      </View>
    </DeviceContext.Provider>
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
  /** Layout merged onto the header row, after the padding. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The card's top row: leading icon tile, title and trailing actions, 24px gutters (18px on mobile).
 *
 * Part of {@link DataTable}. The actions column is coloured like secondary text and pulls 6pt into
 * the header's vertical padding, so an icon button keeps its own footprint without inflating the row.
 */
export function DataTableHeader({ icon, title, actions, style }: DataTableHeaderProps) {
  const theme = useHoronTheme();
  const device = useContext(DeviceContext);

  return (
    <View style={[styles.header, { paddingHorizontal: gutter(device) }, style]}>
      {icon ? (
        <View style={[styles.headerTile, { backgroundColor: theme.color("bg-brand") }]}>{icon}</View>
      ) : null}
      <View style={styles.headerTitle}>
        {isPlainText(title) ? (
          <HoronText variant="label-lg" numberOfLines={1}>
            {title}
          </HoronText>
        ) : (
          title
        )}
      </View>
      {actions ? <View style={styles.headerActions}>{actions}</View> : null}
    </View>
  );
}

/**
 * The sideways scroll container and the column of rows inside it.
 *
 * Part of {@link DataTable}. React's `<table>` scrolled in an `overflow-x-auto` wrapper; React Native
 * has no table element, so the parts are flex lines inside a horizontal `ScrollView`, and the inner
 * column keeps a minimum width so a narrow card scrolls sideways instead of squeezing the columns.
 */
export function DataTableTable({ style, children }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const device = useContext(DeviceContext);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.column, { minWidth: device === "mobile" ? 420 : 520 }, style]}>{children}</View>
    </ScrollView>
  );
}

/** Props of {@link DataTableHead}: the leading icon, the sort state and the press that toggles it. */
export type DataTableHeadProps = {
  /** 14px icon before the label. */
  icon?: ReactNode;
  /** Header label; a string is set in `label-md` secondary text. */
  children?: ReactNode;
  /**
   * The column's sort state, which draws the three-state caret: `asc` up, `desc` down, `none` the
   * up-down caret at 60%. Omit it for a column that does not sort.
   */
  sorted?: "asc" | "desc" | "none";
  /** Called when the head is pressed; a sortable column passes its own toggle here. */
  onPress?: () => void;
  /** Layout merged onto the cell, after its gutters. */
  style?: StyleProp<ViewStyle>;
  /** Hides the first cell's left gutter; the view sets it on the first column. */
  first?: boolean;
  /** Hides the cell's right gutter; the view sets it on the last column. */
  last?: boolean;
};

/**
 * Header cell: 52px, 14px icon and label-md secondary text.
 *
 * Part of {@link DataTable}. It draws the top and bottom hairlines and the 24/18pt outer gutters. A
 * sortable head is a `button` whose accessibility value carries `asc`, `desc` or `none`, which is
 * React Native's counterpart of React's `aria-sort`; the caret sits beside the label.
 */
export function DataTableHead({
  icon,
  children,
  sorted,
  onPress,
  style,
  first,
  last,
}: DataTableHeadProps) {
  const theme = useHoronTheme();
  const device = useContext(DeviceContext);
  const caret = sorted === undefined ? null : (
    <View style={sorted === "none" && styles.dim}>
      {sorted === "asc" ? (
        <CaretUp size={14} color={theme.color("text-secondary")} />
      ) : sorted === "desc" ? (
        <CaretDown size={14} color={theme.color("text-secondary")} />
      ) : (
        <CaretUpDown size={14} color={theme.color("text-secondary")} />
      )}
    </View>
  );
  const label = isPlainText(children) ? String(children) : undefined;

  const content = (
    <View style={styles.headInner}>
      {icon}
      {isPlainText(children) ? (
        <HoronText variant="label-md" tone="text-secondary" numberOfLines={1}>
          {children}
        </HoronText>
      ) : (
        children
      )}
      {caret}
    </View>
  );

  const frame: StyleProp<ViewStyle> = [
    styles.head,
    {
      borderColor: theme.color("border-default"),
      paddingLeft: first ? gutter(device) : 0,
      paddingRight: last ? gutter(device) : spacing["3"],
    },
    style,
  ];

  if (!onPress) return <View style={frame}>{content}</View>;

  return (
    <HoronPressable
      role="button"
      accessibilityLabel={label}
      accessibilityValue={{ text: sorted === "desc" ? "descending" : sorted === "asc" ? "ascending" : "none" }}
      onPress={onPress}
      style={frame}
    >
      {content}
    </HoronPressable>
  );
}

/** Body row: one bottom hairline; {@link DataTableView} adds the selected wash and the staggered rise. */
export function DataTableRow({
  style,
  children,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useHoronTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.color("border-default") }, style]}>{children}</View>
  );
}

/**
 * Body cell: 52px; body-sm secondary text unless the content sets its own.
 *
 * Part of {@link DataTable}. It keeps text on one line and uses the same 24/18pt outer gutters as the head.
 */
export function DataTableCell({
  style,
  first,
  last,
  children,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Applies the first cell's left gutter. */
  first?: boolean;
  /** Applies the last cell's right gutter. */
  last?: boolean;
}) {
  const device = useContext(DeviceContext);
  return (
    <View
      style={[
        styles.cell,
        { paddingLeft: first ? gutter(device) : 0, paddingRight: last ? gutter(device) : spacing["3"] },
        style,
      ]}
    >
      {children}
    </View>
  );
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
  const theme = useHoronTheme();
  return (
    <View style={styles.item}>
      <View style={[styles.itemTile, { backgroundColor: theme.color("surface-ink") }]}>
        {isPlainText(logo) ? (
          <HoronText variant="label-sm" tone="text-on-ink">
            {logo}
          </HoronText>
        ) : (
          logo
        )}
      </View>
      <View style={styles.itemName}>
        {isPlainText(children) ? (
          <HoronText variant="label-lg" numberOfLines={1}>
            {children}
          </HoronText>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

/**
 * Figma `Table tag`: brand (sky tint) or neutral (subtle) label, 8px radius.
 * Part of {@link DataTable}; it draws a non-interactive view, so it fits inside a cell's content.
 */
export function DataTableTag({
  tone = "brand",
  style,
  children,
}: {
  /** `brand` is the sky tint with brand text; `neutral` is the subtle fill with secondary text. @default "brand" */
  tone?: "brand" | "neutral";
  /** Layout merged onto the tag. */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const theme = useHoronTheme();
  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: theme.color(tone === "brand" ? "bg-brand" : "bg-subtle"),
          borderCurve: "continuous",
        },
        style,
      ]}
    >
      <HoronText variant="label-md" tone={tone === "brand" ? "text-brand" : "text-secondary"} numberOfLines={1}>
        {children}
      </HoronText>
    </View>
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
  /** Layout merged onto the footer row, after the padding. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Footer: "Add row" with a 16px plus and a caption hint on the right.
 * Part of {@link DataTable}. The add action takes the free width, so the hint stays pinned right;
 * both wrap onto a second line when narrow.
 */
export function DataTableFooter({ onAdd, addLabel = "Add row", hint, style }: DataTableFooterProps) {
  const theme = useHoronTheme();
  const device = useContext(DeviceContext);

  return (
    <View style={[styles.footer, { paddingHorizontal: gutter(device) }, style]}>
      <HoronPressable
        role={onAdd ? "button" : undefined}
        accessibilityLabel={onAdd ? addLabel : undefined}
        onPress={onAdd}
        style={styles.addRow}
      >
        <Plus size={16} color={theme.color("text-secondary")} />
        <HoronText variant="label-md" tone="text-secondary">
          {addLabel}
        </HoronText>
      </HoronPressable>
      {hint ? (
        isPlainText(hint) ? (
          <HoronText variant="caption" tone="text-secondary">
            {hint}
          </HoronText>
        ) : (
          <View style={styles.nowrap}>{hint}</View>
        )
      ) : null}
    </View>
  );
}

/** The `meta` a horon column can carry; `DataTableView` reads it for the head icon and the two width hooks. */
export type DataTableColumnMeta = {
  /** 14px icon before the header label. */
  icon?: ReactNode;
  /**
   * Extra layout for this column's header cell. A `w-*` width class (`w-12`, `w-[72px]`) pins the
   * column to that width in points, which is how a React call site pins a column.
   */
  headClassName?: string;
  /** Extra layout for each body cell of this column; the same `w-*` class pins the body too. */
  cellClassName?: string;
};

/**
 * The table features every horon data table supports: sorting, filtering, selection and pagination.
 *
 * React exported the object `tableFeatures(...)` built, which bound TanStack's row models. React
 * Native has no TanStack Table in the allowed dependency set, so those four features are
 * implemented inside this file and the export is the plain list of what a {@link DataTableColumn}
 * may rely on.
 */
export const dataTableFeatures = { sorting: true, filtering: true, selection: true, pagination: true } as const;

/** The feature set `dataTableFeatures` describes; the type every column and table instance is parameterised by. */
export type DataTableFeatures = typeof dataTableFeatures;

/**
 * One row of a built table: the row object, where it sat in the data, and its selection state.
 * Internal to this file; React's rows were TanStack's and are not part of the public surface.
 */
type TableRow<TData> = {
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
  cell?: (context: { row: TableRow<TData>; value: unknown; table: DataTableInstance<TData> }) => ReactNode;
  /** `false` drops the sort caret and the press target. Defaults to sortable whenever the column has an `accessorKey`. */
  enableSorting?: boolean;
  /** Icon and per-column width hooks; see {@link DataTableColumnMeta}. */
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
  rows: TableRow<TData>[];
  /** The rows of the current page, after sorting. */
  pageRows: TableRow<TData>[];
  /** The active sorting, in React's `state.sorting` shape: one entry while a column is sorted. */
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

/** The column id the parts use for keys and sorting; `accessorKey` stands in when no explicit id is given. */
function columnId<TData>(column: DataTableColumn<TData>, index: number): string {
  return column.id ?? column.accessorKey ?? `column-${index}`;
}

/**
 * The width a column's `w-*` class pins it to, in points, or `undefined` for a fluid column.
 * `w-12` is 12 × 4 = 48pt and `w-[72px]` is 72pt, which is what the Tailwind classes meant.
 */
function pinnedWidth(meta: DataTableColumnMeta | undefined): number | undefined {
  const source = `${meta?.headClassName ?? ""} ${meta?.cellClassName ?? ""}`;
  const bracket = source.match(/(?:^|\s)w-\[(\d+(?:\.\d+)?)px\]/);
  if (bracket?.[1] !== undefined) return Number.parseFloat(bracket[1]);
  const scale = source.match(/(?:^|\s)w-(\d+(?:\.\d+)?)(?=\s|$)/);
  return scale?.[1] === undefined ? undefined : Number.parseFloat(scale[1]) * 4;
}

/**
 * Orders two cell values the way React's default `sortFn_alphanumeric` did: numbers and dates
 * compare numerically, everything else as a case-insensitive string, with empty values first.
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
 * React registered {@link dataTableFeatures} with TanStack and read the row models it built; this
 * hook keeps the same four features in React state, so sorting, global filtering, selection and
 * pagination need no table library. Without `pageSize` every filtered row stays on one page, which
 * is React's `manualPagination` branch. The instance is a plain object rebuilt on each render;
 * handing it to the three parts is all the wiring there is.
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
    const key = columns[index]?.accessorKey;
    if (key === undefined) return filtered;
    const direction = active.desc ? -1 : 1;
    // oxlint-disable-next-line unicorn/no-array-sort -- toSorted is ES2023 and not on every Hermes build; this sorts a fresh copy
    return [...filtered].sort((left, right) => direction * compareValues(left.row[key], right.row[key]));
  }, [columns, filtered, sort]);

  const size = pageSize === undefined ? sorted.length : pageSize;
  const pageCount = size <= 0 ? 1 : Math.max(1, Math.ceil(sorted.length / size));
  const pageIndex = Math.min(page, pageCount - 1);
  const pageEntries = sorted.slice(pageIndex * size, pageIndex * size + size);

  const toRow = (entry: { row: TData; index: number; id: string }): TableRow<TData> => ({
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
 * Part of the {@link DataTable} set. The header box reports indeterminate when only some page rows
 * are selected, each cell box is labelled "Select row <n>" and is disabled when the table does not
 * allow selecting that row, and the column is pinned 48pt wide and unsortable.
 *
 * @typeParam TData - Shape of one row.
 * @returns A column definition to put first in the `columns` array; it reads the table's own selection state.
 */
export function dataTableSelectColumn<TData>(): DataTableColumn<TData> {
  return {
    id: "select",
    enableSorting: false,
    meta: { headClassName: "w-12", cellClassName: "w-12" },
    header: ({ table }) => (
      <Checkbox
        size="sm"
        style={styles.selectBox}
        accessibilityLabel="Select all rows"
        checked={table.allPageSelected}
        indeterminate={!table.allPageSelected && table.somePageSelected}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        size="sm"
        style={styles.selectBox}
        accessibilityLabel={`Select row ${row.index + 1}`}
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
  /** Layout merged onto the row column. */
  style?: StyleProp<ViewStyle>;
};

/** One body row that rises into place, 30ms after the row above it. */
function RiseRow({
  index,
  selected,
  children,
}: {
  index: number;
  selected: boolean;
  children?: ReactNode;
}) {
  const theme = useHoronTheme();
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return;
    }
    Animated.timing(rise, {
      toValue: 1,
      duration: duration.popIn,
      delay: index * 30,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
    // The row replays its rise when the page or the sort remounts it.
  }, [index, theme.reducedMotion, rise]);

  return (
    <Animated.View
      style={[
        {
          opacity: rise,
          transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
        selected && { backgroundColor: theme.color("overlay-ink-4") },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Renders one cell: the column's own renderer, or its plain value as body-sm secondary text. */
function renderCell<TData>(
  column: DataTableColumn<TData>,
  row: TableRow<TData>,
  table: DataTableInstance<TData>,
): ReactNode {
  const value = column.accessorKey === undefined ? undefined : row.original[column.accessorKey];
  if (column.cell !== undefined) return column.cell({ row, value, table });
  if (value === undefined || value === null) return null;
  return (
    <HoronText variant="body-sm" tone="text-secondary" numberOfLines={1}>
      {String(value)}
    </HoronText>
  );
}

/**
 * Renders a `useDataTable` instance with the Figma head and body cells; sortable heads toggle on press.
 *
 * A sortable head is a press target with a three-state caret (none, ascending, descending); a
 * non-sortable head shows the column's `meta.icon` instead. Rows rise in 30ms apart, and a selected
 * row keeps a 4% ink wash. A sort or page change remounts the body, so the stagger replays. An empty
 * page renders one full-width cell with `emptyMessage`.
 *
 * Columns are flex lines, so a column that declares a `w-*` class in `meta.headClassName` or
 * `meta.cellClassName` is pinned to that width and the rest share what is left; give both hooks the
 * same width so a head and its cells line up. A card narrower than the column set scrolls sideways.
 *
 * @typeParam TData - Shape of one row, matching the instance.
 */
export function DataTableView<TData>({ table, emptyMessage = "No results.", style }: DataTableViewProps<TData>) {
  const lastIndex = table.columns.length - 1;
  const sortKey = table.sort.map((entry) => `${entry.id}${entry.desc ? "d" : "a"}`).join();

  const cellStyle = (column: DataTableColumn<TData>): ViewStyle => {
    const width = pinnedWidth(column.meta);
    return width === undefined ? styles.fluid : { width, flexGrow: 0, flexShrink: 0 };
  };

  return (
    <DataTableTable style={style}>
      <View style={styles.headRow}>
        {table.columns.map((column, index) => {
          const id = columnId(column, index);
          const canSort = column.enableSorting !== false && column.accessorKey !== undefined;
          const active = table.sort.find((entry) => entry.id === id);
          const sorted: "asc" | "desc" | "none" = active === undefined ? "none" : active.desc ? "desc" : "asc";
          const header = typeof column.header === "function" ? column.header({ table }) : column.header;

          return (
            <DataTableHead
              key={id}
              icon={column.meta?.icon}
              sorted={canSort ? sorted : undefined}
              onPress={canSort ? () => table.toggleSort(id) : undefined}
              first={index === 0}
              last={index === lastIndex}
              style={cellStyle(column)}
            >
              {header}
            </DataTableHead>
          );
        })}
      </View>
      {table.pageRows.length === 0 ? (
        <DataTableRow>
          <DataTableCell first last style={styles.emptyCell}>
            {isPlainText(emptyMessage) ? (
              <HoronText variant="body-sm" tone="text-secondary">
                {emptyMessage}
              </HoronText>
            ) : (
              emptyMessage
            )}
          </DataTableCell>
        </DataTableRow>
      ) : (
        table.pageRows.map((row, index) => (
          <RiseRow key={`${table.pageIndex}:${sortKey}:${row.id}`} index={index} selected={row.selected}>
            <DataTableRow>
              {table.columns.map((column, position) => {
                const id = columnId(column, position);
                return (
                  <DataTableCell
                    key={id}
                    first={position === 0}
                    last={position === lastIndex}
                    style={cellStyle(column)}
                  >
                    {renderCell(column, row, table)}
                  </DataTableCell>
                );
              })}
            </DataTableRow>
          </RiseRow>
        ))
      )}
    </DataTableTable>
  );
}

/**
 * Props for {@link DataTableSearch}.
 * @typeparam TData - Shape of one row.
 */
export type DataTableSearchProps<TData> = {
  /** Instance from {@link useDataTable}. */
  table: DataTableInstance<TData>;
  /** Field placeholder; it is also the visible accessible name. @default "Search" */
  placeholder?: string;
  /** Layout merged onto the field. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Solid search field bound to the table's global filter.
 * Part of the {@link DataTable} set: it is a small `Input` with a magnifier, writes every keystroke
 * into the table's global filter and reads the current value back from the table state, so it stays
 * in sync when something else clears the filter.
 *
 * @typeParam TData - Shape of one row.
 */
export function DataTableSearch<TData>({ table, placeholder = "Search", style }: DataTableSearchProps<TData>) {
  const theme = useHoronTheme();
  return (
    <Input
      surface="solid"
      size="sm"
      icon={<MagnifyingGlass size={16} color={theme.color("text-secondary")} />}
      placeholder={placeholder}
      value={table.globalFilter}
      onChange={(value) => table.setGlobalFilter(value)}
      style={style}
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
  /** Layout merged onto the row, after the padding. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Row count (or selection count) with previous and next page buttons.
 *
 * Part of the {@link DataTable} set. With a selection it reads "n of m selected", otherwise "n rows"
 * (singular for one); the page label always shows at least one page, and each arrow is disabled at
 * its end of the range. The count follows the filtered rows, not the raw data.
 *
 * @typeParam TData - Shape of one row.
 */
export function DataTablePagination<TData>({ table, style }: DataTablePaginationProps<TData>) {
  const theme = useHoronTheme();
  const device = useContext(DeviceContext);
  const total = table.totalRows;
  const selected = table.selectedCount;
  const pageCount = Math.max(table.pageCount, 1);

  return (
    <View style={[styles.pagination, { paddingHorizontal: gutter(device) }, style]}>
      <HoronText variant="caption" tone="text-secondary" style={styles.numbers}>
        {selected > 0 ? `${selected} of ${total} selected` : `${total} ${total === 1 ? "row" : "rows"}`}
      </HoronText>
      <View style={styles.pager}>
        <IconButton
          size="sm"
          icon={<CaretLeft size={16} color={theme.color("text-primary")} />}
          label="Previous page"
          onPress={() => table.previousPage()}
          disabled={!table.canPreviousPage}
        />
        <HoronText variant="caption" tone="text-secondary" style={styles.numbers}>
          {`Page ${table.pageIndex + 1} of ${pageCount}`}
        </HoronText>
        <IconButton
          size="sm"
          icon={<CaretRight size={16} color={theme.color("text-primary")} />}
          label="Next page"
          onPress={() => table.nextPage()}
          disabled={!table.canNextPage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    paddingVertical: 18,
  },
  headerTile: {
    width: 26,
    height: 26,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xs,
    borderCurve: "continuous",
  },
  headerTitle: { flex: 1, minWidth: 0 },
  headerActions: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: spacing["3"], marginVertical: -6 },
  scrollContent: { flexGrow: 1 },
  column: { flexGrow: 1, flexDirection: "column" },
  headRow: { flexDirection: "row" },
  head: {
    height: ROW,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  headInner: { flexDirection: "row", alignItems: "center", gap: spacing["2"], flexShrink: 1 },
  row: { flexDirection: "row", borderBottomWidth: 1 },
  cell: {
    height: ROW,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  // Checkbox pins itself to the start so it never stretches in a column; in a row cell that start is the top.
  selectBox: { alignSelf: "center" },
  fluid: { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
  emptyCell: { flexGrow: 1, height: 96, justifyContent: "center" },
  item: { flexDirection: "row", alignItems: "center", gap: spacing["2.5"], minWidth: 0, flexShrink: 1 },
  itemTile: {
    width: 24,
    height: 24,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xs,
    borderCurve: "continuous",
  },
  itemName: { minWidth: 0, flexShrink: 1 },
  tag: {
    height: 26,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.sm,
    paddingHorizontal: spacing["2.5"],
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["2"],
    rowGap: spacing["1"],
    paddingTop: spacing["3.5"],
    paddingBottom: spacing["4"],
  },
  addRow: { flexGrow: 1, flexShrink: 1, flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  nowrap: { flexShrink: 0 },
  pagination: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: spacing["4"],
    rowGap: spacing["2"],
    paddingVertical: spacing["3"],
  },
  pager: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  numbers: { fontVariant: ["tabular-nums"] },
  dim: { opacity: 0.6 },
});
