import {
  DataTable,
  DataTableFooter,
  DataTableHeader,
  DataTableItem,
  DataTableTag,
  DataTableView,
  useDataTable,
  type DataTableColumn,
  type DataTableDevice,
} from "@horon-ai/react";

type Tool = { name: string; logo: string; tag: string };

const rows: Tool[] = [
  { name: "Figma", logo: "F", tag: "Design" },
  { name: "Linear", logo: "L", tag: "Issues" },
  { name: "Loom", logo: "L", tag: "Video" },
];

const columns: DataTableColumn<Tool>[] = [
  {
    accessorKey: "name",
    header: "Tool",
    cell: ({ row }) => <DataTableItem logo={row.original.logo}>{row.original.name}</DataTableItem>,
  },
  {
    accessorKey: "tag",
    header: "Category",
    cell: ({ row }) => <DataTableTag tone="neutral">{row.original.tag}</DataTableTag>,
  },
];

function Table({ device, className }: { device: DataTableDevice; className: string }) {
  const table = useDataTable({ data: rows, columns, getRowId: (row) => row.name });

  return (
    <DataTable device={device} className={className}>
      <DataTableHeader title="Design Stack" />
      <DataTableView table={table} />
      <DataTableFooter hint={device === "mobile" ? "Scroll for more" : "3 tools"} />
    </DataTable>
  );
}

export default function DataTableDevices() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Table device="desktop" className="w-full max-w-140" />
      <Table device="tablet" className="w-full max-w-120" />
      <Table device="mobile" className="w-full max-w-89.5" />
    </div>
  );
}
