import { useState } from "react";
import { Text, View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Tabs, TabsList, TabsPanel, TabsTab } from "../../src/components/tabs";
import { HoronProvider } from "../../src/provider";

/** A controlled set, the way a screen owns its tab. */
function Controlled() {
  const [tab, setTab] = useState("general");
  return (
    <View>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTab value="general">General</TabsTab>
          <TabsTab value="billing">Billing</TabsTab>
        </TabsList>
        <TabsPanel value="general">General settings</TabsPanel>
        <TabsPanel value="billing">Three open invoices</TabsPanel>
      </Tabs>
      <Text>at {tab}</Text>
    </View>
  );
}

test("pressing a tab selects it, swaps its panel and marks the tab selected", async () => {
  await render(
    <HoronProvider scheme="light">
      <Controlled />
    </HoronProvider>,
  );
  expect(screen.getByText("General settings")).toBeTruthy();
  expect(screen.queryByText("Three open invoices")).toBeNull();

  await fireEvent.press(screen.getByRole("tab", { name: "Billing" }));

  expect(screen.getByText("Three open invoices")).toBeTruthy();
  expect(screen.queryByText("General settings")).toBeNull();
  expect(screen.getByText("at billing")).toBeTruthy();
  expect(screen.getByRole("tab", { name: "Billing" }).props.accessibilityState).toMatchObject({ selected: true });
});

test("an uncontrolled tab set starts on defaultValue and selects its own tab", async () => {
  await render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="b">
        <TabsList>
          <TabsTab value="a">Alpha</TabsTab>
          <TabsTab value="b">Beta</TabsTab>
        </TabsList>
        <TabsPanel value="a">Alpha panel</TabsPanel>
        <TabsPanel value="b">Beta panel</TabsPanel>
      </Tabs>
    </HoronProvider>,
  );
  expect(screen.getByText("Beta panel")).toBeTruthy();
  await fireEvent.press(screen.getByRole("tab", { name: "Alpha" }));
  expect(screen.getByText("Alpha panel")).toBeTruthy();
});

test("a disabled tab announces itself as disabled and selects nothing", async () => {
  await render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTab value="a">Alpha</TabsTab>
          <TabsTab value="b" disabled>
            Beta
          </TabsTab>
        </TabsList>
      </Tabs>
    </HoronProvider>,
  );
  const tab = screen.getByRole("tab", { name: "Beta" });
  await fireEvent.press(tab);
  expect(tab.props.accessibilityState).toMatchObject({ disabled: true, selected: false });
  expect(screen.getByRole("tab", { name: "Alpha" }).props.accessibilityState).toMatchObject({ selected: true });
});
