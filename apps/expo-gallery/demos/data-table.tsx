import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MagnifyingGlass, Robot } from "phosphor-react-native";
import {
  DataTable,
  DataTableCell,
  DataTableFooter,
  DataTableHeader,
  DataTableItem,
  DataTablePagination,
  DataTableSearch,
  DataTableTag,
  DataTableRow,
  DataTableView,
  HoronText,
  IconButton,
  dataTableSelectColumn,
  useDataTable,
  useHoronTheme,
  type DataTableColumn,
} from "@horon-ai/expo";

type Bot = { id: string; name: string; owner: string; schedule: string; updated: string };

const BOTS: Bot[] = [
  { id: "1", name: "Morning digest", owner: "Min-yeol", schedule: "Weekly", updated: "Nov 18" },
  { id: "2", name: "Inbox triage", owner: "Min-yeol", schedule: "Hourly", updated: "Nov 18" },
  { id: "3", name: "Spec watcher", owner: "Haneul", schedule: "Daily", updated: "Nov 17" },
  { id: "4", name: "Release notes", owner: "Jiwoo", schedule: "Weekly", updated: "Nov 16" },
  { id: "5", name: "Standup summary", owner: "Min-yeol", schedule: "Daily", updated: "Nov 15" },
  { id: "6", name: "Metric sweep", owner: "Haneul", schedule: "Hourly", updated: "Nov 14" },
  { id: "7", name: "Vendor check", owner: "Jiwoo", schedule: "Monthly", updated: "Nov 12" },
  { id: "8", name: "Archive tidy", owner: "Min-yeol", schedule: "Monthly", updated: "Nov 10" },
];

const columns: DataTableColumn<Bot>[] = [
  dataTableSelectColumn<Bot>(),
  {
    accessorKey: "name",
    header: "Bot",
    meta: { headClassName: "w-48", cellClassName: "w-48" },
    cell: ({ row }) => <DataTableItem logo={row.original.name.slice(0, 1)}>{row.original.name}</DataTableItem>,
  },
  { accessorKey: "owner", header: "Owner" },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ value }) => (
      <DataTableTag tone={value === "Weekly" ? "brand" : "neutral"}>{String(value)}</DataTableTag>
    ),
  },
  { accessorKey: "updated", header: "Updated" },
];

export default function DataTableDemo() {
  const theme = useHoronTheme();
  const [added, setAdded] = useState(0);
  const table = useDataTable({ data: BOTS, columns, pageSize: 4, enableRowSelection: true });

  return (
    <View style={styles.stack}>
      <DataTable>
        <DataTableHeader
          icon={<Robot size={16} color={theme.color("text-brand")} />}
          title="Bots"
          actions={<IconButton size="sm" variant="quiet" icon={<MagnifyingGlass />} label="Search bots" />}
        />
        <View style={styles.toolbar}>
          <View style={styles.search}>
            <DataTableSearch table={table} placeholder="Search bots" />
          </View>
        </View>
        <DataTableView table={table} emptyMessage="No bots match that search." />
        <DataTableFooter onAdd={() => setAdded((value) => value + 1)} hint={`${BOTS.length} bots`} />
        <DataTablePagination table={table} />
      </DataTable>

      <HoronText variant="label-sm" tone="text-secondary">
        Mobile device gutters · 18pt, sideways scroll
      </HoronText>
      <DataTable device="mobile">
        <DataTableHeader title="Bots" />
        <DataTableRow>
          <DataTableCell first>
            <HoronText variant="body-sm" tone="text-secondary">
              A row without a view, for hand-built tables.
            </HoronText>
          </DataTableCell>
          <DataTableCell last>
            <DataTableTag>Pinned</DataTableTag>
          </DataTableCell>
        </DataTableRow>
      </DataTable>

      <HoronText variant="caption" tone="text-secondary">
        added {added} rows
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  toolbar: { flexDirection: "row", paddingHorizontal: 24, paddingBottom: 12 },
  search: { flex: 1 },
});
