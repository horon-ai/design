import { useState } from "react";
import { Text, View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { TabBar } from "../../src/components/tab-bar";
import { HoronProvider } from "../../src/provider";

const ITEMS = [
  { value: "home", label: "Home", icon: <Text>H</Text> },
  { value: "search", label: "Search", icon: <Text>S</Text> },
];

/** The bar wired to a selection, the way a screen owns the route. */
function Nav() {
  const [tab, setTab] = useState("home");
  return (
    <View>
      <TabBar aria-label="Sections" value={tab} onValueChange={setTab} items={ITEMS} />
      <Text>at {tab}</Text>
    </View>
  );
}

test("pressing a TabBar tab reports its value and marks the new tab selected", async () => {
  await render(
    <HoronProvider scheme="light">
      <Nav />
    </HoronProvider>,
  );
  expect(screen.getByRole("tab", { name: "Home" }).props.accessibilityState).toMatchObject({ selected: true });
  await fireEvent.press(screen.getByRole("tab", { name: "Search" }));
  expect(screen.getByText("at search")).toBeTruthy();
  expect(screen.getByRole("tab", { name: "Search" }).props.accessibilityState).toMatchObject({ selected: true });
});
