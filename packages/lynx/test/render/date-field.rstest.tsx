import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { DateField } from "../../src/components/date-field";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** The trigger, found through the role it announces rather than through its classes. */
const triggerOf = (container: HTMLElement): Element =>
  requireElement(container.querySelector('[accessibility-role-description="date field"]'));

/** Gives the trigger a box and opens the popup over it. */
const openField = (container: HTMLElement) => {
  const trigger = triggerOf(container);
  fireEvent.layoutchange(trigger, { detail: { left: 24, top: 60, width: 280, height: 40 } });
  fireEvent.tap(trigger);
  return trigger;
};

/** True for a real `Date`, used to narrow the recorded handler argument. */
const isDate = (value: unknown): value is Date => value instanceof Date;

/** The rendered day whose spoken label is the given date. */
const dayByName = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) => element.getAttribute("accessibility-label") === label,
  );
  if (!node) throw new Error(`no day labelled ${label}`);
  return node;
};

// A fixed month, a fixed "today" and an explicit locale keep the grid and the trigger text
// independent of the run date and the host locale.
const MONTH = new Date(2026, 10, 1);
const TODAY = new Date(2026, 10, 7);

test("the trigger opens the calendar and a day tap reports that day", async () => {
  const onValueChange = rstest.fn();
  const { container, findByText, getByText } = render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" defaultMonth={MONTH} today={TODAY} value={null} onValueChange={onValueChange} />
    </HoronProvider>,
  );

  expect(getByText("Pick a date")).toBeInTheDocument();
  openField(container);
  expect(await findByText("November 2026")).toBeInTheDocument();

  fireEvent.tap(dayByName(container, "Friday, November 20, 2026"));

  expect(onValueChange).toHaveBeenCalledTimes(1);
  const [picked] = onValueChange.mock.calls[0] ?? [];
  if (!isDate(picked)) throw new Error("the value handler did not receive a Date");
  expect(picked.getFullYear()).toBe(2026);
  expect(picked.getMonth()).toBe(10);
  expect(picked.getDate()).toBe(20);
});

test("a chosen day is written into the trigger and the placeholder is gone", () => {
  const { getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" defaultMonth={MONTH} today={TODAY} value={new Date(2026, 9, 20)} />
    </HoronProvider>,
  );

  expect(getByText("Oct 20, 2026")).toBeInTheDocument();
  expect(queryByText("Pick a date")).toBeNull();
});

test("an enabled field announces the button trait and opens the calendar", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" defaultMonth={MONTH} today={TODAY} value={null} />
    </HoronProvider>,
  );

  expect(triggerOf(container).getAttribute("accessibility-traits")).toBe("button");
  openField(container);

  expect(await findByText("November 2026")).toBeInTheDocument();
});

test("a disabled field never opens the calendar", () => {
  const onValueChange = rstest.fn();
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" defaultMonth={MONTH} today={TODAY} disabled onValueChange={onValueChange} />
    </HoronProvider>,
  );

  openField(container);

  expect(triggerOf(container).getAttribute("accessibility-traits")).toBe("disabled");
  expect(queryByText("November 2026")).toBeNull();
  expect(onValueChange).not.toHaveBeenCalled();
});
