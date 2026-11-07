import {
  DataTable,
  DataTableFooter,
  DataTableHeader,
  DataTableSearch,
  DataTableView,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";

type Source = { id: string; name: string; kind: string };

const empty: Source[] = [];

const columns: DataTableColumn<Source>[] = [
  { accessorKey: "name", header: "Source" },
  { accessorKey: "kind", header: "Kind" },
];

export default function DataTableEmpty() {
  const table = useDataTable({ data: empty, columns, getRowId: (row) => row.id });

  return (
    <DataTable className="w-full max-w-140">
      <DataTableHeader
        title="Knowledge sources"
        actions={<DataTableSearch table={table} placeholder="Search sources" />}
      />
      <DataTableView table={table} emptyMessage="No sources yet. Add a page or a file." />
      <DataTableFooter addLabel="Add source" hint="0 sources" />
    </DataTable>
  );
}
