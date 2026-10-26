import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Checkbox,
  DataTable,
  DataTableCell,
  DataTableFooter,
  DataTableHead,
  DataTableHeader,
  DataTableItem,
  DataTableRow,
  DataTableTable,
  DataTableTag,
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

const rows = [
  { logo: "F", name: "Figma", tag: "Design", tone: "brand" as const, site: "figma.com", renews: "Mar 12, 2026" },
  {
    logo: "L",
    name: "Linear",
    tag: "Issue tracking",
    tone: "brand" as const,
    site: "linear.app",
    renews: "Jun 3, 2026",
  },
  { logo: "L", name: "Loom", tag: "Video", tone: "neutral" as const, site: "loom.com", renews: "Nov 18, 2026" },
];

const meta = { title: "Web/DataTable", component: DataTable } satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DataTable className="w-240">
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
      <DataTableTable>
        <thead>
          <tr>
            <DataTableHead className="w-12">
              <Checkbox size="sm" aria-label="Select all" />
            </DataTableHead>
            <DataTableHead icon={<ListChecks />} className="w-75">
              Tool
            </DataTableHead>
            <DataTableHead icon={<SquaresFour />} className="w-60">
              Category
            </DataTableHead>
            <DataTableHead icon={<ArrowSquareOut />} className="w-50">
              Website
            </DataTableHead>
            <DataTableHead icon={<CalendarBlank />}>Renews</DataTableHead>
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
              <DataTableCell className="underline">{row.site}</DataTableCell>
              <DataTableCell>{row.renews}</DataTableCell>
            </DataTableRow>
          ))}
        </tbody>
      </DataTableTable>
      <DataTableFooter hint="Double-click a cell to edit" />
    </DataTable>
  ),
};
