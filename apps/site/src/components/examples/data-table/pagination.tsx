import {
  DataTable,
  DataTableHeader,
  DataTablePagination,
  DataTableTag,
  DataTableView,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";
import { CalendarBlank, SquaresFour } from "@phosphor-icons/react";

type Run = { id: string; workflow: string; category: string; started: Date };

const rows: Run[] = [
  { id: "r-31", workflow: "Morning brief", category: "Digest", started: new Date(2026, 10, 2) },
  { id: "r-30", workflow: "Inbox triage", category: "Inbox", started: new Date(2026, 10, 2) },
  { id: "r-29", workflow: "Invoice parse", category: "Finance", started: new Date(2026, 10, 1) },
  { id: "r-28", workflow: "Weekly digest", category: "Digest", started: new Date(2026, 9, 27) },
  { id: "r-27", workflow: "Source refresh", category: "Knowledge", started: new Date(2026, 9, 26) },
  { id: "r-26", workflow: "Invoice parse", category: "Finance", started: new Date(2026, 9, 25) },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const columns: DataTableColumn<Run>[] = [
  { accessorKey: "workflow", header: "Workflow" },
  {
    accessorKey: "category",
    header: "Category",
    meta: { icon: <SquaresFour /> },
    cell: ({ row }) => <DataTableTag tone="neutral">{row.original.category}</DataTableTag>,
  },
  {
    accessorKey: "started",
    header: "Started",
    meta: { icon: <CalendarBlank /> },
    cell: ({ row }) => dateFormat.format(row.original.started),
  },
];

export default function DataTablePaginationExample() {
  const table = useDataTable({ data: rows, columns, getRowId: (row) => row.id, pageSize: 3 });

  return (
    <DataTable className="w-full max-w-140">
      <DataTableHeader title="Recent runs" />
      <DataTableView table={table} />
      <DataTablePagination table={table} />
    </DataTable>
  );
}
