import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Select, type SelectItemData } from "../../src/components/select";
import { HoronProvider } from "../../src/provider";

const items: SelectItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "writer", label: "Writer" },
  { value: "archived", label: "Archived bot", disabled: true },
];

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** The trigger, found through the role it announces rather than through its classes. */
const triggerOf = (container: HTMLElement): Element =>
  requireElement(container.querySelector('[accessibility-role-description="select"]'));

/** Gives the trigger a box, so the popup has an anchor to place itself against. */
const openSelect = (container: HTMLElement) => {
  const trigger = triggerOf(container);
  fireEvent.layoutchange(trigger, { detail: { left: 24, top: 60, width: 240, height: 40 } });
  fireEvent.tap(trigger);
  return trigger;
};

test("a row tap reports its value, shows its label and closes the popup", async () => {
  const onValueChange = rstest.fn();
  const { container, findByText, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} placeholder="Select a bot" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  expect(getByText("Select a bot")).toBeInTheDocument();
  openSelect(container);

  fireEvent.tap(await findByText("Writer"));

  expect(onValueChange).toHaveBeenCalledWith("writer");
  expect(queryByText("Chief of staff")).toBeNull();
  expect(queryByText("Select a bot")).toBeNull();
  expect(getByText("Writer")).toBeInTheDocument();
});

test("a disabled row ignores the tap and keeps the popup open", async () => {
  const onValueChange = rstest.fn();
  const { container, findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} onValueChange={onValueChange} />
    </HoronProvider>,
  );

  openSelect(container);
  fireEvent.tap(await findByText("Archived bot"));

  expect(onValueChange).not.toHaveBeenCalled();
  expect(queryByText("Chief of staff")).toBeInTheDocument();
});

test("a disabled select never opens", async () => {
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} disabled />
    </HoronProvider>,
  );

  openSelect(container);

  expect(triggerOf(container).getAttribute("accessibility-traits")).toBe("disabled");
  expect(queryByText("Chief of staff")).toBeNull();
});

test("a controlled select reports the pick without moving on its own", async () => {
  const onValueChange = rstest.fn();
  const { container, findByText, getByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} value="chief" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  openSelect(container);
  fireEvent.tap(await findByText("Writer"));

  expect(onValueChange).toHaveBeenCalledWith("writer");
  expect(getByText("Chief of staff")).toBeInTheDocument();
});
