import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import {
  DataTable,
  DataTableFooter,
  DataTablePagination,
  DataTableView,
  dataTableSelectColumn,
  useDataTable,
  type DataTableColumn,
} from "../../src/components/data-table";
import { HoronProvider } from "../../src/provider";

type Tool = { name: string; tag: string };

const rows: Tool[] = [
  { name: "Figma", tag: "Design" },
  { name: "Linear", tag: "Issue tracking" },
  { name: "Loom", tag: "Video" },
  { name: "Notion", tag: "Docs" },
];

const names = rows.map((row) => row.name);

const columns: DataTableColumn<Tool>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "tag", header: "Tag" },
];

/** A card with the parts the acceptance criteria read: the table, its count and the add-row footer. */
function Harness({
  data = rows,
  enableRowSelection = false,
  withSelection = false,
}: {
  data?: Tool[];
  enableRowSelection?: boolean;
  withSelection?: boolean;
}) {
  const table = useDataTable({
    data,
    columns: withSelection ? [dataTableSelectColumn<Tool>(), ...columns] : columns,
    getRowId: (row) => row.name,
    pageSize: 10,
    enableRowSelection,
  });

  return (
    <HoronProvider scheme="light">
      <DataTable>
        <DataTableView table={table} />
        <DataTablePagination table={table} />
        <DataTableFooter />
      </DataTable>
    </HoronProvider>
  );
}

/** The sortable head cell for a label, found by the `columnheader` role the head reports. */
const head = (container: HTMLElement, label: string): Element => {
  const cell = [...container.querySelectorAll('[accessibility-role-description="columnheader"]')].find((element) =>
    element.textContent?.includes(label),
  );
  if (!cell) throw new Error(`no head for ${label}`);
  return cell;
};

/** Every row name on screen, in render order. */
const shownNames = (container: HTMLElement): string[] =>
  [...container.querySelectorAll("text")]
    .map((element) => element.textContent ?? "")
    .filter((text) => names.includes(text));

/** A checkbox by its accessible name. */
const checkbox = (container: HTMLElement, label: string): Element => {
  const found = container.querySelector(`[accessibility-label="${label}"]`);
  if (!found) throw new Error(`no checkbox named ${label}`);
  return found;
};

test("tapping a sortable head orders the rows ascending, then descending", async () => {
  const { container } = render(<Harness />);

  expect(shownNames(container)).toEqual(names);

  fireEvent.tap(head(container, "Name"));
  await Promise.resolve();
  expect(shownNames(container)).toEqual(["Figma", "Linear", "Loom", "Notion"]);

  fireEvent.tap(head(container, "Name"));
  await Promise.resolve();
  expect(shownNames(container)).toEqual(["Notion", "Loom", "Linear", "Figma"]);
});

test("selection boxes report the selected rows in the count", async () => {
  const { container, getByText } = render(<Harness enableRowSelection withSelection />);

  expect(getByText("4 rows")).toBeInTheDocument();

  fireEvent.tap(checkbox(container, "Select row 2"));
  await Promise.resolve();
  expect(getByText("1 of 4 selected")).toBeInTheDocument();

  fireEvent.tap(checkbox(container, "Select all rows"));
  await Promise.resolve();
  expect(getByText("4 of 4 selected")).toBeInTheDocument();

  fireEvent.tap(checkbox(container, "Select all rows"));
  await Promise.resolve();
  expect(getByText("4 rows")).toBeInTheDocument();
});

test("an empty table renders the empty row instead of body rows", () => {
  const { container, getByText } = render(<Harness data={[]} />);

  expect(getByText("No results.")).toBeInTheDocument();
  expect(shownNames(container)).toEqual([]);
  expect(getByText("0 rows")).toBeInTheDocument();
});

test("a table that does not allow selection keeps its boxes disabled", async () => {
  const { container, getByText } = render(<Harness withSelection />);

  const box = checkbox(container, "Select row 1");
  expect(box.getAttribute("accessibility-traits")).toBe("disabled");

  fireEvent.tap(box);
  await Promise.resolve();
  expect(getByText("4 rows")).toBeInTheDocument();
});
