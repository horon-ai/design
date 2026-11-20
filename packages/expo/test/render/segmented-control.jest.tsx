import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { SegmentedControl } from "../../src/components/segmented-control";
import { HoronProvider } from "../../src/provider";

/** A control a screen keeps in its own state. */
function Picker() {
  const [view, setView] = useState("active");
  return (
    <>
      <SegmentedControl
        aria-label="Projects"
        value={view}
        onValueChange={setView}
        items={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ]}
      />
      <Text>view {view}</Text>
    </>
  );
}

test("pressing a segment selects it and reports its value", async () => {
  await render(
    <HoronProvider scheme="light">
      <Picker />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("tab", { name: "Archived" }));
  expect(screen.getByText("view archived")).toBeTruthy();
  const [active, archived] = screen.getAllByRole("tab");
  expect(archived.props.accessibilityState).toMatchObject({ selected: true });
  expect(active.props.accessibilityState).toMatchObject({ selected: false });
});
