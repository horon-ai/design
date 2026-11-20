import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Chip } from "../../src/components/chip";
import { HoronProvider } from "../../src/provider";

test("tapping a Chip toggles it and reports each next state", async () => {
  const states: boolean[] = [];
  await render(
    <HoronProvider scheme="light">
      <Chip onPressedChange={(next) => states.push(next)}>Documents</Chip>
    </HoronProvider>,
  );
  const chip = screen.getByRole("button", { name: "Documents" });
  await fireEvent.press(chip);
  await fireEvent.press(screen.getByRole("button", { name: "Documents" }));
  expect(states).toEqual([true, false]);
  expect(screen.getByRole("button", { name: "Documents" }).props.accessibilityState).toMatchObject({
    selected: false,
  });
});
