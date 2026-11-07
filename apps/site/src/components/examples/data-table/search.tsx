import {
  DataTable,
  DataTableHeader,
  DataTablePagination,
  DataTableSearch,
  DataTableTag,
  DataTableView,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";

type Source = { id: string; name: string; kind: string };

const rows: Source[] = [
  { id: "s-1", name: "Handbook", kind: "Page" },
  { id: "s-2", name: "Pricing sheet", kind: "File" },
  { id: "s-3", name: "Release notes", kind: "Feed" },
  { id: "s-4", name: "Onboarding doc", kind: "Page" },
];

const columns: DataTableColumn<Source>[] = [
  { accessorKey: "name", header: "Source" },
  {
    accessorKey: "kind",
    header: "Kind",
    cell: ({ row }) => <DataTableTag tone="neutral">{row.original.kind}</DataTableTag>,
  },
];

export default function DataTableSearchExample() {
  const table = useDataTable({ data: rows, columns, getRowId: (row) => row.id });

  return (
    <DataTable className="w-full max-w-140">
      <DataTableHeader
        title="Knowledge sources"
        actions={<DataTableSearch table={table} placeholder="Search sources" />}
      />
      <DataTableView table={table} emptyMessage="No source matches that search." />
      <DataTablePagination table={table} />
    </DataTable>
  );
}
