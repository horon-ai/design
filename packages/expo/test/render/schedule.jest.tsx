import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { PickerField, WeekdayPicker } from "../../src/components/schedule";
import { HoronProvider } from "../../src/provider";

const REPEAT = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

const DAYS = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
];

test("picking an option reports the value and shows it on the trigger", async () => {
  const picked: (string | null)[] = [];
  await render(
    <HoronProvider scheme="light">
      <PickerField
        aria-label="Repeat"
        items={REPEAT}
        defaultValue="daily"
        onValueChange={(next) => picked.push(next)}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("combobox", { name: "Repeat" }));
  await fireEvent.press(screen.getByRole("menuitem", { name: "Weekly" }));
  expect(picked).toEqual(["weekly"]);
  expect(screen.getByText("Weekly")).toBeTruthy();
});

test("the day picker reports the whole selection after a toggle", async () => {
  const changes: string[][] = [];
  await render(
    <HoronProvider scheme="light">
      <WeekdayPicker aria-label="Repeat on" days={DAYS} defaultValue={["mon"]} onValueChange={(next) => changes.push(next)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Tuesday" }));
  expect(changes).toEqual([["mon", "tue"]]);
  await fireEvent.press(screen.getByRole("button", { name: "Monday" }));
  expect(changes[1]).toEqual(["tue"]);
});

test("a controlled picker keeps showing the value its caller owns", async () => {
  await render(
    <HoronProvider scheme="light">
      <PickerField aria-label="Repeat" items={REPEAT} value="daily" />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("combobox", { name: "Repeat" }));
  await fireEvent.press(screen.getByRole("menuitem", { name: "Weekly" }));
  expect(screen.getByText("Daily")).toBeTruthy();
  expect(screen.queryByText("Weekly")).toBeNull();
});
