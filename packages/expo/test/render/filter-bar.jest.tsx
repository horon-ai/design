import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { FilterBar } from "../../src/components/filter-bar";
import { HoronProvider } from "../../src/provider";

test("pressing an option selects it and reports its value, even when already selected", async () => {
  const seen: string[] = [];
  await render(
    <HoronProvider scheme="light">
      <FilterBar
        aria-label="Scope"
        defaultValue="all"
        onValueChange={(next) => seen.push(next)}
        items={[
          { value: "all", label: "All", count: 12 },
          { value: "agents", label: "Agents", count: 4 },
        ]}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getAllByRole("radio")[1]);
  await fireEvent.press(screen.getAllByRole("radio")[1]);
  expect(seen).toEqual(["agents", "agents"]);
  const [all, agents] = screen.getAllByRole("radio");
  expect(agents.props.accessibilityState).toMatchObject({ checked: true });
  expect(all.props.accessibilityState).toMatchObject({ checked: false });
});
