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
import { CalendarBlank, FileText, ListChecks, SquaresFour } from "@phosphor-icons/react";

const rows = [
  { logo: "F", name: "Figma", tag: "Design", tone: "brand" as const, renews: "Mar 12, 2026" },
  { logo: "L", name: "Linear", tag: "Issue tracking", tone: "brand" as const, renews: "Jun 3, 2026" },
  { logo: "L", name: "Loom", tag: "Video", tone: "neutral" as const, renews: "Nov 18, 2026" },
];

export default function DataTableDemo() {
  return (
    <DataTable className="max-w-160">
      <DataTableHeader icon={<FileText />} title="Design Stack" />
      <DataTableTable>
        <thead>
          <tr>
            <DataTableHead className="w-12">
              <Checkbox size="sm" aria-label="Select all" />
            </DataTableHead>
            <DataTableHead icon={<ListChecks />}>Tool</DataTableHead>
            <DataTableHead icon={<SquaresFour />}>Category</DataTableHead>
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
              <DataTableCell>{row.renews}</DataTableCell>
            </DataTableRow>
          ))}
        </tbody>
      </DataTableTable>
      <DataTableFooter hint="Double-click a cell to edit" />
    </DataTable>
  );
}
