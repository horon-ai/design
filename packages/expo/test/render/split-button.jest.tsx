import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { MenuItem } from "../../src/components/menu";
import { SplitButton } from "../../src/components/split-button";
import { HoronProvider } from "../../src/provider";

test("the primary half runs onPress and leaves the menu closed", async () => {
  let calls = 0;
  await render(
    <HoronProvider scheme="light">
      <SplitButton onPress={() => (calls += 1)} menu={<MenuItem>Schedule</MenuItem>}>
        Publish
      </SplitButton>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Publish" }));
  expect(calls).toBe(1);
  expect(screen.queryByText("Schedule")).toBeNull();
});

test("the caret opens the menu and a menu item runs without the primary action", async () => {
  let primary = 0;
  let scheduled = 0;
  await render(
    <HoronProvider scheme="light">
      <SplitButton onPress={() => (primary += 1)} menu={<MenuItem onClick={() => (scheduled += 1)}>Schedule</MenuItem>}>
        Publish
      </SplitButton>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByLabelText("More actions"));
  await fireEvent.press(screen.getByText("Schedule"));
  expect(scheduled).toBe(1);
  expect(primary).toBe(0);
});
