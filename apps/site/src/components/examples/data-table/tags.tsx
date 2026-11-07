import {
  DataTable,
  DataTableHeader,
  DataTableTag,
  DataTableView,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";

type Agent = { name: string; state: string; tone: "brand" | "neutral" };

const rows: Agent[] = [
  { name: "Inbox Manager", state: "Ready", tone: "brand" },
  { name: "Weekly digest", state: "Scheduled", tone: "neutral" },
  { name: "Invoice parser", state: "Scheduled", tone: "neutral" },
  { name: "Source refresh", state: "Waiting", tone: "neutral" },
];

const columns: DataTableColumn<Agent>[] = [
  { accessorKey: "name", header: "Agent" },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => <DataTableTag tone={row.original.tone}>{row.original.state}</DataTableTag>,
  },
];

export default function DataTableTags() {
  const table = useDataTable({ data: rows, columns, getRowId: (row) => row.name });

  return (
    <DataTable className="w-full max-w-120">
      <DataTableHeader title="Agents" />
      <DataTableView table={table} />
    </DataTable>
  );
}
