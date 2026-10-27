import {
  DataTable,
  DataTableFooter,
  DataTableHeader,
  DataTableItem,
  DataTableTag,
  DataTableView,
  dataTableSelectColumn,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";
import { CalendarBlank, FileText, ListChecks, SquaresFour } from "@phosphor-icons/react";

type Tool = { logo: string; name: string; tag: string; tone: "brand" | "neutral"; renews: Date };

const rows: Tool[] = [
  { logo: "F", name: "Figma", tag: "Design", tone: "brand", renews: new Date(2026, 2, 12) },
  { logo: "L", name: "Linear", tag: "Issue tracking", tone: "brand", renews: new Date(2026, 5, 3) },
  { logo: "L", name: "Loom", tag: "Video", tone: "neutral", renews: new Date(2026, 10, 18) },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const columns: DataTableColumn<Tool>[] = [
  dataTableSelectColumn<Tool>(),
  {
    accessorKey: "name",
    header: "Tool",
    meta: { icon: <ListChecks /> },
    cell: ({ row }) => <DataTableItem logo={row.original.logo}>{row.original.name}</DataTableItem>,
  },
  {
    accessorKey: "tag",
    header: "Category",
    meta: { icon: <SquaresFour /> },
    cell: ({ row }) => <DataTableTag tone={row.original.tone}>{row.original.tag}</DataTableTag>,
  },
  {
    accessorKey: "renews",
    header: "Renews",
    meta: { icon: <CalendarBlank /> },
    cell: ({ row }) => dateFormat.format(row.original.renews),
  },
];

export default function DataTableDemo() {
  const table = useDataTable({ data: rows, columns, getRowId: (row) => row.name, enableRowSelection: true });

  return (
    <DataTable className="w-full max-w-160">
      <DataTableHeader icon={<FileText />} title="Design Stack" />
      <DataTableView table={table} />
      <DataTableFooter hint="Double-click a cell to edit" />
    </DataTable>
  );
}
