import { useState } from "react";
import { Text, View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Button } from "../../src/components/button";
import { HoronProvider } from "../../src/provider";

/** A button wired to a counter, the way a screen counts the action it fires. */
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Button onPress={() => setCount(count + 1)}>Save</Button>
      <Text>saved {count}</Text>
    </View>
  );
}

test("pressing a Button calls onPress once per press", async () => {
  await render(
    <HoronProvider scheme="light">
      <Counter />
    </HoronProvider>,
  );
  const button = screen.getByRole("button", { name: "Save" });
  await fireEvent.press(button);
  await fireEvent.press(button);
  expect(screen.getByText("saved 2")).toBeTruthy();
});

test("a disabled Button ignores presses and announces itself as disabled", async () => {
  let calls = 0;
  await render(
    <HoronProvider scheme="light">
      <Button disabled onPress={() => (calls += 1)}>
        Delete bot
      </Button>
    </HoronProvider>,
  );
  const button = screen.getByRole("button", { name: "Delete bot" });
  expect(button.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(button);
  expect(calls).toBe(0);
});

test("the link variant is a link and a current link is selected", async () => {
  await render(
    <HoronProvider scheme="light">
      <Button variant="link" aria-current="page">
        Settings
      </Button>
    </HoronProvider>,
  );
  const link = screen.getByRole("link", { name: "Settings" });
  expect(link.props.accessibilityState).toMatchObject({ selected: true });
});
