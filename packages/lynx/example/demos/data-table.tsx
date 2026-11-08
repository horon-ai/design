import { useState } from "@lynx-js/react";

import {
  DataTable,
  DataTableFooter,
  DataTableHeader,
  DataTableItem,
  DataTablePagination,
  DataTableSearch,
  DataTableTag,
  DataTableView,
  dataTableSelectColumn,
  useDataTable,
  type DataTableColumn,
  type DataTableDevice,
} from "../../src/components/data-table";
import { Icon } from "../../src/icons";
import { IconButton } from "../../src/components/icon-button";

type Tool = { logo: string; name: string; tag: string; tone: "brand" | "neutral"; renews: Date };

const rows: Tool[] = [
  { logo: "F", name: "Figma", tag: "Design", tone: "brand", renews: new Date(2026, 2, 12) },
  { logo: "L", name: "Linear", tag: "Issue tracking", tone: "brand", renews: new Date(2026, 5, 3) },
  { logo: "L", name: "Loom", tag: "Video", tone: "neutral", renews: new Date(2026, 10, 18) },
  { logo: "N", name: "Notion", tag: "Docs", tone: "neutral", renews: new Date(2026, 7, 9) },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** A cell renderer with the column's own context type, so the columns below share them. */
type ToolCell = NonNullable<DataTableColumn<Tool>["cell"]>;

const nameCell: ToolCell = ({ row }) => <DataTableItem logo={row.original.logo}>{row.original.name}</DataTableItem>;
const tagCell: ToolCell = ({ row }) => <DataTableTag tone={row.original.tone}>{row.original.tag}</DataTableTag>;
const renewsCell: ToolCell = ({ row }) => dateFormat.format(row.original.renews);

/** The four columns of the site demo, with the selection box first. */
const columns: DataTableColumn<Tool>[] = [
  dataTableSelectColumn<Tool>(),
  {
    accessorKey: "name",
    header: "Tool",
    meta: { icon: <Icon name="ListChecks" size={14} color="text-secondary" /> },
    cell: nameCell,
  },
  {
    accessorKey: "tag",
    header: "Category",
    meta: { icon: <Icon name="SquaresFour" size={14} color="text-secondary" /> },
    cell: tagCell,
  },
  {
    accessorKey: "renews",
    header: "Renews",
    meta: { icon: <Icon name="CalendarBlank" size={14} color="text-secondary" /> },
    cell: renewsCell,
  },
];

/** The mobile card drops the date column and pins the three remaining ones, as the site demo does. */
const mobileCols: DataTableColumn<Tool>[] = [
  dataTableSelectColumn<Tool>(),
  {
    accessorKey: "name",
    header: "Tool",
    meta: {
      icon: <Icon name="ListChecks" size={14} color="text-secondary" />,
      headClassName: "w-[150px]",
      cellClassName: "w-[150px]",
    },
    cell: nameCell,
  },
  {
    accessorKey: "tag",
    header: "Category",
    meta: {
      icon: <Icon name="SquaresFour" size={14} color="text-secondary" />,
      headClassName: "w-[164px]",
      cellClassName: "w-[164px]",
    },
    cell: tagCell,
  },
];

/** One card: header, table, search, pagination and footer, all reading the same instance. */
function Table({
  device,
  className,
  cols,
}: {
  device: DataTableDevice;
  className: string;
  cols: DataTableColumn<Tool>[];
}) {
  const [data, setData] = useState<Tool[]>(rows);
  const table = useDataTable({
    data,
    columns: cols,
    getRowId: (row) => row.name,
    pageSize: 3,
    enableRowSelection: true,
  });

  return (
    <DataTable device={device} className={className}>
      <DataTableHeader
        icon={<Icon name="FileText" size={16} color="text-brand" />}
        title="Design Stack"
        actions={
          <>
            <IconButton
              size="sm"
              variant="ghost"
              label="Refresh"
              icon={<Icon name="ArrowClockwise" size={16} color="text-secondary" />}
            />
            <IconButton
              size="sm"
              variant="ghost"
              label="More"
              icon={<Icon name="DotsThree" size={16} color="text-secondary" />}
            />
          </>
        }
      />
      <view className="px-6 pb-3">
        <DataTableSearch table={table} placeholder="Search tools" />
      </view>
      <DataTableView table={table} />
      <DataTablePagination table={table} />
      <DataTableFooter
        onAdd={() =>
          setData((current) => [
            ...current,
            {
              logo: "A",
              name: `Added tool ${current.length + 1}`,
              tag: "Draft",
              tone: "neutral",
              renews: new Date(2026, 11, 1),
            },
          ])
        }
        hint={device === "mobile" ? "Scroll for more" : "Tap a head to sort"}
      />
    </DataTable>
  );
}

/**
 * The site's three cards stacked: desktop, tablet and the pinned mobile card, each with its
 * selection column, sortable heads, search, pagination and add-row footer.
 */
export default function DataTableDemo() {
  return (
    <view className="flex w-full flex-col items-start gap-6 p-4">
      <Table device="desktop" className="w-full" cols={columns} />
      <Table device="tablet" className="w-full" cols={columns} />
      <Table device="mobile" className="w-full" cols={mobileCols} />
    </view>
  );
}
