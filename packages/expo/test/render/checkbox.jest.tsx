import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Checkbox } from "../../src/components/checkbox";
import { HoronProvider } from "../../src/provider";

/** A checkbox a screen keeps in its own state. */
function Controlled() {
  const [ticked, setTicked] = useState(false);
  return (
    <>
      <Checkbox accessibilityLabel="Remember" checked={ticked} onCheckedChange={setTicked} />
      <Text>remember {ticked ? "on" : "off"}</Text>
    </>
  );
}

test("tapping a Checkbox reports the next state and follows the caller's value", async () => {
  await render(
    <HoronProvider scheme="light">
      <Controlled />
    </HoronProvider>,
  );
  const box = screen.getByRole("checkbox", { name: "Remember" });
  await fireEvent.press(box);
  expect(screen.getByText("remember on")).toBeTruthy();
  expect(box.props.accessibilityState).toMatchObject({ checked: true });
  await fireEvent.press(box);
  expect(screen.getByText("remember off")).toBeTruthy();
});

test("an indeterminate Checkbox announces the mixed state", async () => {
  await render(
    <HoronProvider scheme="light">
      <Checkbox accessibilityLabel="Select all rows" indeterminate />
    </HoronProvider>,
  );
  const box = screen.getByRole("checkbox", { name: "Select all rows" });
  expect(box.props.accessibilityState).toMatchObject({ checked: "mixed" });
});
