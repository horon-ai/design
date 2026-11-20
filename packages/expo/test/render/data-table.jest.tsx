import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import {
  DataTable,
  DataTablePagination,
  DataTableView,
  dataTableSelectColumn,
  useDataTable,
  type DataTableColumn,
} from "../../src/components/data-table";
import { HoronProvider } from "../../src/provider";

type Bot = { id: string; name: string };

const BOTS: Bot[] = [
  { id: "1", name: "Beta" },
  { id: "2", name: "Alpha" },
  { id: "3", name: "Gamma" },
];

const COLUMNS: DataTableColumn<Bot>[] = [{ accessorKey: "name", header: "Bot" }];

/** Names in the order the table painted them. */
function names(): unknown[] {
  return screen.getAllByText(/^(Alpha|Beta|Gamma)$/).map((node) => node.props.children);
}

/** Every row on one page, so the sort order is visible in full. */
function Sortable() {
  const table = useDataTable({ data: BOTS, columns: COLUMNS });
  return (
    <DataTable>
      <DataTableView table={table} />
    </DataTable>
  );
}

/** One row per page, so the pager has three pages. */
function PagedTable() {
  const table = useDataTable({ data: BOTS, columns: COLUMNS, pageSize: 1 });
  return (
    <DataTable>
      <DataTableView table={table} />
      <DataTablePagination table={table} />
    </DataTable>
  );
}

/** Two rows per page and selectable rows, the way a bulk-action screen sets it up. */
function SelectableTable() {
  const table = useDataTable({
    data: BOTS,
    columns: [dataTableSelectColumn<Bot>(), ...COLUMNS],
    pageSize: 2,
    enableRowSelection: true,
  });
  return (
    <DataTable>
      <DataTableView table={table} />
      <DataTablePagination table={table} />
    </DataTable>
  );
}

test("pressing a sortable head cycles the row order", async () => {
  await render(
    <HoronProvider scheme="light">
      <Sortable />
    </HoronProvider>,
  );
  const head = screen.getByRole("button", { name: "Bot" });
  expect(names()).toEqual(["Beta", "Alpha", "Gamma"]);
  await fireEvent.press(head);
  expect(names()).toEqual(["Alpha", "Beta", "Gamma"]);
  await fireEvent.press(head);
  expect(names()).toEqual(["Gamma", "Beta", "Alpha"]);
  await fireEvent.press(head);
  expect(names()).toEqual(["Beta", "Alpha", "Gamma"]);
});

test("the pager moves one page at a time and stops at the ends", async () => {
  await render(
    <HoronProvider scheme="light">
      <PagedTable />
    </HoronProvider>,
  );
  const previous = screen.getByRole("button", { name: "Previous page" });
  const next = screen.getByRole("button", { name: "Next page" });
  expect(previous.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(next);
  expect(screen.getByText("Page 2 of 3")).toBeTruthy();
  await fireEvent.press(next);
  expect(screen.getByText("Page 3 of 3")).toBeTruthy();
  expect(next.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(previous);
  expect(screen.getByText("Page 2 of 3")).toBeTruthy();
});

test("selecting every row selects the current page only", async () => {
  await render(
    <HoronProvider scheme="light">
      <SelectableTable />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("checkbox", { name: "Select all rows" }));
  expect(screen.getByText("2 of 3 selected")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Next page" }));
  await fireEvent.press(screen.getByRole("checkbox", { name: "Select row 3" }));
  expect(screen.getByText("3 of 3 selected")).toBeTruthy();
});
