import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Calendar } from "../../src/components/calendar";
import { HoronProvider } from "../../src/provider";

/** One recorded call's first argument, narrowed by the caller's type guard. */
const firstArg = <T,>(calls: unknown[][], guard: (value: unknown) => value is T, name: string): T => {
  const call = calls[0];
  if (!call) throw new Error(`the ${name} handler was never called`);
  if (!guard(call[0])) throw new Error(`the ${name} handler received the wrong shape`);
  return call[0];
};

/** True for a real `Date`. */
const isDate = (value: unknown): value is Date => value instanceof Date;

/** True for a `DateRange` shape, whose ends are dates or null. */
const isRange = (value: unknown): value is { start: Date | null; end: Date | null } => {
  if (typeof value !== "object" || value === null) return false;
  const { start, end } = value as { start?: unknown; end?: unknown };
  return (start === null || isDate(start)) && (end === null || isDate(end));
};

/** The rendered day whose spoken label starts with the given weekday-free date text. */
const dayByName = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find((element) => element.getAttribute("accessibility-label") === label);
  if (!node) throw new Error(`no day labelled ${label}`);
  return node;
};

// A fixed month, a fixed "today" and an explicit locale keep the grid and its labels
// independent of the run date and the host locale.
const MONTH = new Date(2026, 10, 1);
const TODAY = new Date(2026, 10, 7);

test("tapping a day reports that day and paints it selected", () => {
  const onValueChange = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <Calendar locale="en-US" defaultMonth={MONTH} today={TODAY} value={null} onValueChange={onValueChange} />
    </HoronProvider>,
  );

  expect(getByText("November 2026")).toBeInTheDocument();
  fireEvent.tap(dayByName(container, "Friday, November 20, 2026"));

  expect(onValueChange).toHaveBeenCalledTimes(1);
  const picked = firstArg(onValueChange.mock.calls, isDate, "value");
  expect(picked.getFullYear()).toBe(2026);
  expect(picked.getMonth()).toBe(10);
  expect(picked.getDate()).toBe(20);
});

test("a disabled day cannot be selected", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Calendar
        locale="en-US"
        defaultMonth={MONTH}
        today={TODAY}
        value={null}
        isDateDisabled={(date) => date.getDate() === 20}
        onValueChange={onValueChange}
      />
    </HoronProvider>,
  );

  const blocked = dayByName(container, "Friday, November 20, 2026");
  expect(blocked.getAttribute("accessibility-traits")).toBe("disabled");

  fireEvent.tap(blocked);

  expect(onValueChange).not.toHaveBeenCalled();
});

test("the arrows move the month and report the first day of it", () => {
  const onMonthChange = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <Calendar locale="en-US" defaultMonth={MONTH} today={TODAY} onMonthChange={onMonthChange} />
    </HoronProvider>,
  );

  const next = [...container.querySelectorAll("view")].find((element) => element.getAttribute("accessibility-label") === "Next month");
  if (!next) throw new Error("no next-month button");
  fireEvent.tap(next);

  expect(onMonthChange).toHaveBeenCalledTimes(1);
  const month = firstArg(onMonthChange.mock.calls, isDate, "month");
  expect(month.getMonth()).toBe(11);
  expect(month.getDate()).toBe(1);
  expect(getByText("December 2026")).toBeInTheDocument();
});

test("range mode stores the tapped endpoints and leaves the second end empty after the first tap", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Calendar mode="range" locale="en-US" defaultMonth={MONTH} today={TODAY} value={{ start: null, end: null }} onValueChange={onValueChange} />
    </HoronProvider>,
  );

  fireEvent.tap(dayByName(container, "Friday, November 20, 2026"));

  const first = firstArg(onValueChange.mock.calls, isRange, "value");
  expect(first.start?.getDate()).toBe(20);
  expect(first.end).toBeNull();
});
