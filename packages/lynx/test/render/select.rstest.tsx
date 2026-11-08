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

/** The trigger's placeholder box, given to every popup test so the popup has an anchor to place against. */
const anchor = { detail: { left: 24, top: 60, width: 240, height: 40 } };

/** Gives the trigger a box, so the popup has an anchor to place itself against. */
const openSelect = (container: HTMLElement) => {
  const trigger = triggerOf(container);
  fireEvent.layoutchange(trigger, anchor);
  fireEvent.tap(trigger);
  return trigger;
};

/**
 * The full-viewport blocking layer. The popup is the other `fixed` view; the backdrop carries no
 * `z-50`, which is how the two are told apart.
 */
const backdropOf = (container: HTMLElement): Element | null =>
  [...container.querySelectorAll(".fixed")].find(
    (element) => !(element.getAttribute("class") ?? "").includes("z-50"),
  ) ?? null;

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

test("a controlled popup reports the request instead of opening itself", () => {
  const onOpenChange = rstest.fn();
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} open={false} onOpenChange={onOpenChange} />
    </HoronProvider>,
  );

  openSelect(container);

  expect(onOpenChange).toHaveBeenCalledTimes(1);
  expect(onOpenChange.mock.calls[0][0]).toBe(true);
  expect(onOpenChange.mock.calls[0][1]?.reason).toBe("trigger-press");
  expect(queryByText("Chief of staff")).toBeNull();
  expect(triggerOf(container).getAttribute("accessibility-value")).toBe("collapsed");
});

test("a controlled open popup paints and reports a pick without closing itself", async () => {
  const onOpenChange = rstest.fn();
  const onValueChange = rstest.fn();
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Select
        aria-label="Bot"
        items={items}
        open
        value="chief"
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      />
    </HoronProvider>,
  );

  fireEvent.layoutchange(triggerOf(container), anchor);
  fireEvent.tap(await findByText("Writer"));

  expect(onValueChange).toHaveBeenCalledWith("writer");
  expect(onOpenChange).toHaveBeenCalledTimes(1);
  expect(onOpenChange.mock.calls[0][0]).toBe(false);
  expect(onOpenChange.mock.calls[0][1]?.reason).toBe("item-press");
  expect(triggerOf(container).getAttribute("accessibility-value")).toBe("expanded");
});

test("cancelling the open request keeps the popup shut", () => {
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} onOpenChange={(_open, details) => details?.cancel()} />
    </HoronProvider>,
  );

  openSelect(container);

  expect(queryByText("Chief of staff")).toBeNull();
  expect(triggerOf(container).getAttribute("accessibility-value")).toBe("collapsed");
});

test("defaultOpen paints the popup on the first frame", async () => {
  const onOpenChangeComplete = rstest.fn();
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} defaultOpen onOpenChangeComplete={onOpenChangeComplete} />
    </HoronProvider>,
  );

  fireEvent.layoutchange(triggerOf(container), anchor);

  expect(await findByText("Chief of staff")).toBeInTheDocument();
  expect(triggerOf(container).getAttribute("accessibility-value")).toBe("expanded");
  expect(onOpenChangeComplete).not.toHaveBeenCalled();
});

test("onOpenChangeComplete reports the settled state after the popup moves", async () => {
  const onOpenChangeComplete = rstest.fn();
  const { container, findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} onOpenChangeComplete={onOpenChangeComplete} />
    </HoronProvider>,
  );

  openSelect(container);
  await findByText("Chief of staff");
  expect(onOpenChangeComplete).toHaveBeenLastCalledWith(true);

  fireEvent.tap(requireElement(backdropOf(container)));

  expect(onOpenChangeComplete).toHaveBeenLastCalledWith(false);
  expect(queryByText("Chief of staff")).toBeNull();
});

test("a read-only select opens for browsing but keeps its value", async () => {
  const onValueChange = rstest.fn();
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} value="chief" readOnly onValueChange={onValueChange} />
    </HoronProvider>,
  );

  openSelect(container);
  fireEvent.tap(await findByText("Writer"));

  expect(onValueChange).not.toHaveBeenCalled();
  expect(triggerOf(container).getAttribute("accessibility-value")).toBe("expanded");
  expect(triggerOf(container).getAttribute("accessibility-traits")).toBe("button");
  expect(triggerOf(container).textContent).toContain("Chief of staff");
});

test("the backdrop closes the popup and a non-modal popup paints none", async () => {
  const onOpenChange = rstest.fn();
  const { container, findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} onOpenChange={onOpenChange} />
    </HoronProvider>,
  );

  openSelect(container);
  await findByText("Chief of staff");
  fireEvent.tap(requireElement(backdropOf(container)));

  const lastCall = onOpenChange.mock.calls.at(-1);
  expect(lastCall?.[0]).toBe(false);
  expect(lastCall?.[1]?.reason).toBe("outside-press");
  expect(queryByText("Chief of staff")).toBeNull();
});

test("modal={false} leaves the page tappable by painting no backdrop", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} modal={false} defaultOpen />
    </HoronProvider>,
  );

  fireEvent.layoutchange(triggerOf(container), anchor);
  await findByText("Chief of staff");

  expect(backdropOf(container)).toBeNull();
});

test("itemToStringLabel renames the chosen value in the trigger", () => {
  const { getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} value="chief" itemToStringLabel={(item) => `#${item}`} />
    </HoronProvider>,
  );

  expect(getByText("#chief")).toBeInTheDocument();
  expect(queryByText("Chief of staff")).toBeNull();
});

test("isItemEqualToValue matches a value written differently from the item's", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Select
        aria-label="Bot"
        items={items}
        value="CHIEF"
        isItemEqualToValue={(item, chosen) => item.toLowerCase() === chosen.toLowerCase()}
      />
    </HoronProvider>,
  );

  openSelect(container);
  await findByText("Writer");

  const marked = container.querySelector('[accessibility-value="selected"]');
  expect(marked).not.toBeNull();
  expect(marked?.textContent).toContain("Chief of staff");
});

test("style lands on the trigger", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Select aria-label="Bot" items={items} style={{ marginTop: "12px" }} />
    </HoronProvider>,
  );

  expect(triggerOf(container).getAttribute("style")).toContain("12px");
});
