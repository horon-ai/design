import {
  DataTable,
  DataTableCell,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  DataTableTable,
  DataTableTag,
} from "@horon-ai/react";
import { ListChecks, SquaresFour } from "@phosphor-icons/react";

/** A static facsimile of an open table: TanStack only fills rows after interaction, so the
 * head, item and tag primitives are laid out directly with two representative rows. */
export default function DataTableThumbnail() {
  return (
    <DataTable className="w-80">
      <DataTableTable>
        <thead>
          <tr>
            <DataTableHead icon={<ListChecks />}>Tool</DataTableHead>
            <DataTableHead icon={<SquaresFour />}>Category</DataTableHead>
          </tr>
        </thead>
        <tbody>
          <DataTableRow>
            <DataTableCell>
              <DataTableItem logo="F">Figma</DataTableItem>
            </DataTableCell>
            <DataTableCell>
              <DataTableTag>Design</DataTableTag>
            </DataTableCell>
          </DataTableRow>
          <DataTableRow>
            <DataTableCell>
              <DataTableItem logo="L">Linear</DataTableItem>
            </DataTableCell>
            <DataTableCell>
              <DataTableTag tone="neutral">Issues</DataTableTag>
            </DataTableCell>
          </DataTableRow>
        </tbody>
      </DataTableTable>
    </DataTable>
  );
}
