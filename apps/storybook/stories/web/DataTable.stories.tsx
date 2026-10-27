import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Checkbox,
  DataTable,
  DataTableCell,
  DataTableFooter,
  DataTableHead,
  DataTableHeader,
  DataTableItem,
  DataTablePagination,
  DataTableRow,
  DataTableSearch,
  DataTableTable,
  DataTableTag,
  DataTableView,
  dataTableSelectColumn,
  useDataTable,
  type DataTableColumn,
} from "@horon-ai/react";
import {
  ArrowClockwise,
  ArrowSquareOut,
  CalendarBlank,
  DotsThree,
  FileText,
  ListChecks,
  SquaresFour,
} from "@phosphor-icons/react";

type Tool = {
  logo: string;
  name: string;
  tag: string;
  tone: "brand" | "neutral";
  site: string;
  renews: Date;
};

const rows: Tool[] = [
  { logo: "F", name: "Figma", tag: "Design", tone: "brand", site: "figma.com", renews: new Date(2026, 2, 12) },
  { logo: "L", name: "Linear", tag: "Issue tracking", tone: "brand", site: "linear.app", renews: new Date(2026, 5, 3) },
  { logo: "L", name: "Loom", tag: "Video", tone: "neutral", site: "loom.com", renews: new Date(2026, 10, 18) },
];

const moreRows: Tool[] = [
  ...rows,
  { logo: "N", name: "Notion", tag: "Docs", tone: "neutral", site: "notion.so", renews: new Date(2026, 0, 9) },
  { logo: "S", name: "Slack", tag: "Chat", tone: "brand", site: "slack.com", renews: new Date(2026, 3, 21) },
  { logo: "G", name: "GitHub", tag: "Code", tone: "brand", site: "github.com", renews: new Date(2026, 7, 1) },
  { logo: "V", name: "Vercel", tag: "Hosting", tone: "neutral", site: "vercel.com", renews: new Date(2026, 8, 14) },
  { logo: "S", name: "Sentry", tag: "Monitoring", tone: "neutral", site: "sentry.io", renews: new Date(2026, 4, 30) },
  { logo: "R", name: "Raycast", tag: "Launcher", tone: "brand", site: "raycast.com", renews: new Date(2026, 11, 2) },
  { logo: "A", name: "Arc", tag: "Browser", tone: "neutral", site: "arc.net", renews: new Date(2026, 6, 7) },
  { logo: "C", name: "Cursor", tag: "Editor", tone: "brand", site: "cursor.com", renews: new Date(2026, 1, 26) },
  { logo: "P", name: "Postman", tag: "API", tone: "neutral", site: "postman.com", renews: new Date(2026, 9, 11) },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const columns: DataTableColumn<Tool>[] = [
  dataTableSelectColumn<Tool>(),
  {
    accessorKey: "name",
    header: "Tool",
    meta: { icon: <ListChecks />, headClassName: "w-75" },
    cell: ({ row }) => <DataTableItem logo={row.original.logo}>{row.original.name}</DataTableItem>,
  },
  {
    accessorKey: "tag",
    header: "Category",
    meta: { icon: <SquaresFour />, headClassName: "w-60" },
    cell: ({ row }) => <DataTableTag tone={row.original.tone}>{row.original.tag}</DataTableTag>,
  },
  {
    accessorKey: "site",
    header: "Website",
    enableSorting: false,
    meta: { icon: <ArrowSquareOut />, headClassName: "w-50", cellClassName: "underline" },
  },
  {
    accessorKey: "renews",
    header: "Renews",
    meta: { icon: <CalendarBlank /> },
    cell: ({ row }) => dateFormat.format(row.original.renews),
  },
];

const getRowId = (row: Tool) => row.name;

const meta = { title: "Web/DataTable", component: DataTable } satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultTable() {
  const table = useDataTable({ data: rows, columns, getRowId, enableRowSelection: true });

  return (
    <DataTable className="w-full max-w-240">
      <DataTableHeader
        icon={<FileText />}
        title="Design Stack"
        actions={
          <>
            <ArrowClockwise aria-label="Refresh" />
            <DotsThree aria-label="More" />
          </>
        }
      />
      <DataTableView table={table} />
      <DataTableFooter hint="Double-click a cell to edit" />
    </DataTable>
  );
}

/** Figma `Data table` driven by TanStack Table: click a head to sort, tick boxes to select. */
export const Default: Story = { render: () => <DefaultTable /> };

function SearchAndPagesTable() {
  const table = useDataTable({ data: moreRows, columns, getRowId, enableRowSelection: true, pageSize: 5 });

  return (
    <DataTable className="w-full max-w-240">
      <DataTableHeader
        icon={<FileText />}
        title="Design Stack"
        actions={<DataTableSearch table={table} placeholder="Search tools" className="w-48" />}
      />
      <DataTableView table={table} emptyMessage="No tools match your search." />
      <DataTablePagination table={table} />
    </DataTable>
  );
}

/** Global search over the text columns, five rows per page. */
export const SearchAndPages: Story = { render: () => <SearchAndPagesTable /> };

function EmptyTable() {
  const table = useDataTable({ data: [], columns, getRowId });

  return (
    <DataTable className="w-full max-w-240">
      <DataTableHeader icon={<FileText />} title="Design Stack" />
      <DataTableView table={table} emptyMessage="No tools yet." />
      <DataTableFooter />
    </DataTable>
  );
}

export const Empty: Story = { render: () => <EmptyTable /> };

/** The same Figma parts composed by hand, without a TanStack table. */
export const Composition: Story = {
  render: () => (
    <DataTable className="w-full max-w-240">
      <DataTableHeader icon={<FileText />} title="Design Stack" />
      <DataTableTable>
        <thead>
          <tr>
            <DataTableHead className="w-12">
              <Checkbox size="sm" aria-label="Select all" />
            </DataTableHead>
            <DataTableHead icon={<ListChecks />} className="w-75">
              Tool
            </DataTableHead>
            <DataTableHead icon={<SquaresFour />}>Category</DataTableHead>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <DataTableRow key={row.name}>
              <DataTableCell>
                <Checkbox size="sm" aria-label={`Select ${row.name}`} />
              </DataTableCell>
              <DataTableCell>
                <DataTableItem logo={row.logo}>{row.name}</DataTableItem>
              </DataTableCell>
              <DataTableCell>
                <DataTableTag tone={row.tone}>{row.tag}</DataTableTag>
              </DataTableCell>
            </DataTableRow>
          ))}
        </tbody>
      </DataTableTable>
      <DataTableFooter hint="Double-click a cell to edit" />
    </DataTable>
  ),
};
