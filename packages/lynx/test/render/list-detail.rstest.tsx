import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { ListDetail } from "../../src/components/list-detail";
import { HoronProvider } from "../../src/provider";

const groups = [
  {
    id: "active",
    label: "ACTIVE",
    items: [
      { id: "weekly", title: "Weekly report", meta: "Every Friday" },
      { id: "triage", title: "Issue triage", meta: "On new issue" },
    ],
  },
  { id: "paused", label: "PAUSED", items: [{ id: "digest", title: "Inbox digest", meta: "Paused" }] },
];

/** Rows are announced as options, so the test picks them by that role and reads which one carries the selection. */
const rows = (container: HTMLElement): Element[] => [
  ...container.querySelectorAll("[accessibility-role-description='option']"),
];

test("the first item is selected on mount and its detail pane is drawn", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <ListDetail groups={groups}>{(item) => <text>{`detail-${item.id}`}</text>}</ListDetail>
    </HoronProvider>,
  );

  await findByText("detail-weekly");
  expect(rows(container)[0].getAttribute("accessibility-value")).toBe("selected");
  expect(rows(container)[1].getAttribute("accessibility-value")).toBe("unselected");
});

test("opening a row swaps the detail, and opening the first row again returns to it", async () => {
  const seen: string[] = [];
  const { container, findByText, queryByText } = render(
    <HoronProvider>
      <ListDetail groups={groups} onValueChange={(id) => seen.push(id)}>
        {(item) => <text>{`detail-${item.id}`}</text>}
      </ListDetail>
    </HoronProvider>,
  );

  await findByText("detail-weekly");

  fireEvent.tap(rows(container)[1]);
  await findByText("detail-triage");
  expect(queryByText("detail-weekly")).toBeNull();
  expect(rows(container)[1].getAttribute("accessibility-value")).toBe("selected");

  fireEvent.tap(rows(container)[0]);
  await findByText("detail-weekly");
  expect(queryByText("detail-triage")).toBeNull();

  expect(seen).toEqual(["triage", "weekly"]);
});

test("a controlled selection stays where the caller put it while still reporting the tap", async () => {
  const seen: string[] = [];
  const { container, findByText, queryByText } = render(
    <HoronProvider>
      <ListDetail groups={groups} value="weekly" onValueChange={(id) => seen.push(id)}>
        {(item) => <text>{`detail-${item.id}`}</text>}
      </ListDetail>
    </HoronProvider>,
  );

  await findByText("detail-weekly");
  fireEvent.tap(rows(container)[1]);

  expect(seen).toEqual(["triage"]);
  expect(queryByText("detail-triage")).toBeNull();
  expect(rows(container)[0].getAttribute("accessibility-value")).toBe("selected");
});

test("an empty group list draws no rows and no detail", () => {
  const { container } = render(
    <HoronProvider>
      <ListDetail groups={[]}>{() => <text>detail</text>}</ListDetail>
    </HoronProvider>,
  );

  expect(rows(container)).toHaveLength(0);
});
