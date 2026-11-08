import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { FilterBar, type FilterBarItem } from "../../src/components/filter-bar";
import { HoronProvider } from "../../src/provider";

const items: FilterBarItem[] = [
  { value: "all", label: "All", count: 12 },
  { value: "agents", label: "Agents", count: 4 },
  { value: "archived", label: "Archived", disabled: true },
];

/** The option chip whose accessible name matches. */
const optionByName = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) => element.getAttribute("accessibility-label") === label,
  );
  if (!node) throw new Error(`no option named ${label}`);
  return node;
};

test("tapping an option selects it and reports the value", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <FilterBar items={items} defaultValue="all" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  expect(optionByName(container, "All").getAttribute("accessibility-value")).toBe("checked");
  fireEvent.tap(optionByName(container, "Agents"));

  expect(onValueChange).toHaveBeenCalledWith("agents");
  expect(optionByName(container, "Agents").getAttribute("accessibility-value")).toBe("checked");
  expect(optionByName(container, "All").getAttribute("accessibility-value")).toBe("unchecked");
});

test("a disabled option never selects", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <FilterBar items={items} defaultValue="all" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  fireEvent.tap(optionByName(container, "Archived"));

  expect(onValueChange).not.toHaveBeenCalled();
  expect(optionByName(container, "Archived").getAttribute("accessibility-value")).toBe("unchecked");
});

test("a controlled selection ignores the tap for its own pill position", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <FilterBar items={items} value="agents" />
    </HoronProvider>,
  );

  fireEvent.tap(optionByName(container, "All"));

  expect(optionByName(container, "Agents").getAttribute("accessibility-value")).toBe("checked");
  expect(optionByName(container, "All").getAttribute("accessibility-value")).toBe("unchecked");
});

test("an empty item list renders no options", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <FilterBar items={[]} />
    </HoronProvider>,
  );

  expect(container.querySelectorAll('[accessibility-role-description="radio"]').length).toBe(0);
});
