import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Switch } from "../../src/components/switch";
import { HoronProvider } from "../../src/provider";

/** A switch a screen keeps in its own state, the way a settings row does. */
function Controlled() {
  const [on, setOn] = useState(false);
  return (
    <>
      <Switch accessibilityLabel="Live activity" checked={on} onCheckedChange={setOn} />
      <Text>live {on ? "on" : "off"}</Text>
    </>
  );
}

test("tapping a Switch reports the next state and follows the caller's value", async () => {
  await render(
    <HoronProvider scheme="light">
      <Controlled />
    </HoronProvider>,
  );
  const control = screen.getByRole("switch", { name: "Live activity" });
  await fireEvent.press(control);
  expect(screen.getByText("live on")).toBeTruthy();
  expect(control.props.accessibilityState).toMatchObject({ checked: true });
  await fireEvent.press(control);
  expect(screen.getByText("live off")).toBeTruthy();
});

test("a disabled Switch ignores taps", async () => {
  let calls = 0;
  await render(
    <HoronProvider scheme="light">
      <Switch accessibilityLabel="Locked" disabled onCheckedChange={() => (calls += 1)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("switch", { name: "Locked" }));
  expect(calls).toBe(0);
});
