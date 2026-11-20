import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Calendar, type DateRange } from "../../src/components/calendar";
import { HoronProvider } from "../../src/provider";

/** A month the grid can be asserted against without depending on today's date. */
const MONTH = new Date(2026, 10, 1);

/** A calendar wired to state, the way a picker echoes the day it was handed. */
function Picker() {
  const [day, setDay] = useState<Date | null>(null);
  return <Calendar locale="en-US" defaultMonth={MONTH} value={day} onValueChange={setDay} />;
}

test("tapping a day reports it and a controlled value marks it selected", async () => {
  await render(
    <HoronProvider scheme="light">
      <Picker />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByLabelText("Friday, November 20, 2026"));
  expect(screen.getByLabelText("Friday, November 20, 2026").props.accessibilityState).toMatchObject({ selected: true });
});

test("a disabled day never reports a selection", async () => {
  let chosen: Date | null = null;
  await render(
    <HoronProvider scheme="light">
      <Calendar
        locale="en-US"
        defaultMonth={MONTH}
        isDateDisabled={(date) => date.getDate() === 20}
        onValueChange={(value) => (chosen = value)}
      />
    </HoronProvider>,
  );
  const day = screen.getByLabelText("Friday, November 20, 2026");
  expect(day.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(day);
  expect(chosen).toBeNull();
});

test("the arrows move to the next and previous month", async () => {
  await render(
    <HoronProvider scheme="light">
      <Calendar locale="en-US" defaultMonth={MONTH} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Next month" }));
  expect(screen.getByText("December 2026")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Previous month" }));
  expect(screen.getByText("November 2026")).toBeTruthy();
});

test("in range mode the first tap starts the range and the second closes it", async () => {
  const ranges: DateRange[] = [];
  function Range() {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    ranges.push(range);
    return (
      <Calendar
        mode="range"
        locale="en-US"
        defaultMonth={MONTH}
        value={range}
        onValueChange={(next) => {
          ranges.push(next);
          setRange(next);
        }}
      />
    );
  }
  await render(
    <HoronProvider scheme="light">
      <Range />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByLabelText("Thursday, November 12, 2026"));
  await fireEvent.press(screen.getByLabelText("Monday, November 16, 2026"));
  expect(ranges.at(-1)?.start?.getDate()).toBe(12);
  expect(ranges.at(-1)?.end?.getDate()).toBe(16);
});
