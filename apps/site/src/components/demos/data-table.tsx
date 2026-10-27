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
  type DataTableDevice,
} from "@horon-ai/react";
import { ArrowClockwise, CalendarBlank, DotsThree, FileText, ListChecks, SquaresFour } from "@phosphor-icons/react";

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

const mobileColumns = columns.slice(0, 3);
const widths = ["w-11", "w-37.5", "w-41"];
const mobileCols: DataTableColumn<Tool>[] = mobileColumns.map((c, n) => ({
  ...c,
  meta: { ...c.meta, headClassName: widths[n] },
}));

function Table({
  device,
  className,
  cols,
}: {
  device: DataTableDevice;
  className: string;
  cols: DataTableColumn<Tool>[];
}) {
  const table = useDataTable({ data: rows, columns: cols, getRowId: (row) => row.name, enableRowSelection: true });
  return (
    <DataTable device={device} className={className}>
      <DataTableHeader
        icon={<FileText />}
        title="Design Stack"
        actions={
          <>
            <ArrowClockwise aria-hidden />
            <DotsThree aria-hidden />
          </>
        }
      />
      <DataTableView table={table} />
      <DataTableFooter hint={device === "mobile" ? "Scroll for more" : "Double-click a cell to edit"} />
    </DataTable>
  );
}

export default function DataTableDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <Table device="desktop" className="w-full max-w-240" cols={columns} />
      <Table device="tablet" className="w-full max-w-192" cols={columns} />
      <Table device="mobile" className="w-full max-w-89.5" cols={mobileCols} />
    </div>
  );
}
