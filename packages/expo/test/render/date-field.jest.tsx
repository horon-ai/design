import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { DateField } from "../../src/components/date-field";
import { HoronProvider } from "../../src/provider";

test("the trigger shows the formatted value and opens the calendar on a tap", async () => {
  await render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" value={new Date(2026, 9, 20)} onValueChange={() => undefined} />
    </HoronProvider>,
  );
  const trigger = screen.getByRole("button", { name: "Oct 20, 2026" });
  expect(trigger.props.accessibilityState).toMatchObject({ expanded: false });
  await fireEvent.press(trigger);
  expect(screen.getByRole("button", { name: "Oct 20, 2026" }).props.accessibilityState).toMatchObject({ expanded: true });
  expect(screen.getByText("October 2026")).toBeTruthy();
});

test("a disabled trigger never opens the calendar", async () => {
  await render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" disabled value={new Date(2026, 9, 20)} />
    </HoronProvider>,
  );
  const trigger = screen.getByRole("button", { name: "Oct 20, 2026" });
  expect(trigger.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(trigger);
  expect(screen.queryByText("October 2026")).toBeNull();
});

test("tapping a day in the calendar reports it through the field's value callback", async () => {
  const picked: Date[] = [];
  await render(
    <HoronProvider scheme="light">
      <DateField locale="en-US" value={new Date(2026, 9, 20)} onValueChange={(value) => picked.push(value)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Oct 20, 2026" }));
  await fireEvent.press(screen.getByLabelText("Friday, October 23, 2026"));
  expect(picked[0]?.getDate()).toBe(23);
});
