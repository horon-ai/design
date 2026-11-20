import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
} from "../../src/components/bottom-sheet";
import { Button } from "../../src/components/button";
import { HoronProvider } from "../../src/provider";

/** A sheet whose action row saves a reminder, counting the saves it sees. */
function ReminderSheet() {
  const [saved, setSaved] = useState(0);
  return (
    <BottomSheet>
      <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
      <BottomSheetContent title="Reminder">
        <BottomSheetActions>
          <BottomSheetAction variant="primary" onPress={() => setSaved((value) => value + 1)}>
            Save
          </BottomSheetAction>
        </BottomSheetActions>
        <Text>saved {saved}</Text>
      </BottomSheetContent>
    </BottomSheet>
  );
}

test("the trigger opens the sheet and its action row fires the action's own handler", async () => {
  await render(
    <HoronProvider scheme="light">
      <ReminderSheet />
    </HoronProvider>,
  );
  expect(screen.queryByText("Reminder")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Open sheet" }));
  expect(screen.getByText("Reminder")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.getByText("saved 1")).toBeTruthy();
});

test("a trigger rendered through `render` keeps the caller's children as its label", async () => {
  await render(
    <HoronProvider scheme="light">
      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="solid" />}>Open the sheet</BottomSheetTrigger>
        <BottomSheetContent title="Reminder" />
      </BottomSheet>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Open the sheet" }));
  expect(screen.getByText("Reminder")).toBeTruthy();
});

test("a disabled settings row ignores presses and announces itself as disabled", async () => {
  let presses = 0;
  await render(
    <HoronProvider scheme="light">
      <BottomSheet defaultOpen>
        <BottomSheetContent title="Settings">
          <BottomSheetRow disabled value="Off" onPress={() => (presses += 1)}>
            Notifications
          </BottomSheetRow>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );
  const row = screen.getByRole("button", { name: /Notifications/ });
  expect(row.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(row);
  expect(presses).toBe(0);
});
