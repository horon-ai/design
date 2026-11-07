import {
  DataTable,
  DataTableFooter,
  DataTableHeader,
  DataTableItem,
  DataTablePagination,
  DataTableView,
  dataTableSelectColumn,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";

type Member = { id: string; initials: string; name: string; role: string };

const rows: Member[] = [
  { id: "m-1", initials: "MY", name: "Min-yeol", role: "Owner" },
  { id: "m-2", initials: "DK", name: "Dana Kim", role: "Editor" },
  { id: "m-3", initials: "JP", name: "Jun Park", role: "Viewer" },
  { id: "m-4", initials: "SL", name: "Sora Lee", role: "Viewer" },
];

const columns: DataTableColumn<Member>[] = [
  dataTableSelectColumn<Member>(),
  {
    accessorKey: "name",
    header: "Member",
    cell: ({ row }) => <DataTableItem logo={row.original.initials}>{row.original.name}</DataTableItem>,
  },
  { accessorKey: "role", header: "Role" },
];

export default function DataTableSelectionExample() {
  const table = useDataTable({
    data: rows,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  return (
    <DataTable className="w-full max-w-140">
      <DataTableHeader title="Workspace members" />
      <DataTableView table={table} />
      <DataTableFooter addLabel="Invite member" hint="Changes apply at once" />
      <DataTablePagination table={table} />
    </DataTable>
  );
}
