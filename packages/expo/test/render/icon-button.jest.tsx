import { Gear } from "phosphor-react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { IconButton } from "../../src/components/icon-button";
import { HoronProvider } from "../../src/provider";

test("pressing an IconButton calls onPress once per press", async () => {
  let calls = 0;
  await render(
    <HoronProvider scheme="light">
      <IconButton icon={<Gear />} label="Settings" onPress={() => (calls += 1)} />
    </HoronProvider>,
  );
  const button = screen.getByRole("button", { name: "Settings" });
  await fireEvent.press(button);
  await fireEvent.press(button);
  expect(calls).toBe(2);
});

test("a disabled IconButton ignores presses and announces itself as disabled", async () => {
  let calls = 0;
  await render(
    <HoronProvider scheme="light">
      <IconButton icon={<Gear />} label="Settings" disabled onPress={() => (calls += 1)} />
    </HoronProvider>,
  );
  const button = screen.getByRole("button", { name: "Settings" });
  expect(button.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(button);
  expect(calls).toBe(0);
});
