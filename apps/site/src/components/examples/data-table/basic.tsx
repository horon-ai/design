import {
  DataTable,
  DataTableFooter,
  DataTableHeader,
  DataTableItem,
  DataTableTag,
  DataTableView,
  IconButton,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";
import { ArrowClockwise, FileText, ListChecks, SquaresFour } from "@phosphor-icons/react";

type Tool = { logo: string; name: string; tag: string; renews: Date };

const rows: Tool[] = [
  { logo: "F", name: "Figma", tag: "Design", renews: new Date(2026, 2, 12) },
  { logo: "L", name: "Linear", tag: "Issue tracking", renews: new Date(2026, 5, 3) },
  { logo: "L", name: "Loom", tag: "Video", renews: new Date(2026, 10, 18) },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const columns: DataTableColumn<Tool>[] = [
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
    cell: ({ row }) => <DataTableTag>{row.original.tag}</DataTableTag>,
  },
  {
    accessorKey: "renews",
    header: "Renews",
    cell: ({ row }) => dateFormat.format(row.original.renews),
  },
];

export default function DataTableBasic() {
  const table = useDataTable({ data: rows, columns, getRowId: (row) => row.name });

  return (
    <DataTable className="w-full max-w-160">
      <DataTableHeader
        icon={<FileText />}
        title="Design Stack"
        actions={<IconButton size="sm" variant="ghost" label="Refresh" icon={<ArrowClockwise />} />}
      />
      <DataTableView table={table} />
      <DataTableFooter hint="3 tools" />
    </DataTable>
  );
}
