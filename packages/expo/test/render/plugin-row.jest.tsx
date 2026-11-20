import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { PluginRow } from "../../src/components/plugin-row";
import { HoronProvider } from "../../src/provider";

/** A settings list that keeps the enable switch in its own state. */
function Controlled({ onEnabledChange }: { onEnabledChange: (enabled: boolean) => void }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <PluginRow
      initials="ST"
      name="Stripe"
      enabled={enabled}
      onEnabledChange={(next) => {
        setEnabled(next);
        onEnabledChange(next);
      }}
    />
  );
}

test("the switch reports the next enabled state", async () => {
  const onEnabledChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <Controlled onEnabledChange={onEnabledChange} />
    </HoronProvider>,
  );
  const control = screen.getByRole("switch", { name: "Enabled" });
  await fireEvent.press(control);
  expect(onEnabledChange).toHaveBeenCalledWith(true);
  expect(screen.getByRole("switch", { name: "Enabled" }).props.accessibilityState).toMatchObject({ checked: true });
});

test("the Update button exists only while onUpdate is passed", async () => {
  const onUpdate = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <PluginRow initials="ST" name="Stripe" version="2.4.1" updateBadge="Update ready" onUpdate={onUpdate} />
      <PluginRow initials="LM" name="Linear" version="1.0.0" />
    </HoronProvider>,
  );
  expect(screen.getAllByRole("button", { name: /Update/ })).toHaveLength(1);
  await fireEvent.press(screen.getByRole("button", { name: /Update/ }));
  expect(onUpdate).toHaveBeenCalledTimes(1);
});

test("the overflow menu stays absent without menu items", async () => {
  await render(
    <HoronProvider scheme="light">
      <PluginRow initials="LM" name="Linear" />
    </HoronProvider>,
  );
  expect(screen.queryByRole("button", { name: "More" })).toBeNull();
});
