import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { MenuItem } from "../../src/components/menu";
import { SplitButton } from "../../src/components/split-button";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** Renders a split pill with a labelled primary half and a one-item menu. */
const renderSplit = (onPrimary = rstest.fn(), onSchedule = rstest.fn(), disabled = false) =>
  render(
    <HoronProvider scheme="light">
      <SplitButton
        aria-label="Publish"
        disabled={disabled}
        onClick={onPrimary}
        menu={<MenuItem onClick={onSchedule}>Schedule</MenuItem>}
      >
        Publish
      </SplitButton>
    </HoronProvider>,
  );

/** Gives the caret's measuring wrapper a box, so the popup has an anchor to place itself against. */
const layoutCaret = (container: HTMLElement): Element => {
  const caret = requireElement(container.querySelector('[accessibility-label="More actions"]'));
  fireEvent.layoutchange(caret, { detail: { left: 100, top: 200, width: 28, height: 32 } });
  return caret;
};

test("the primary half runs its own action and leaves the menu closed", () => {
  const onPrimary = rstest.fn();
  const onSchedule = rstest.fn();
  const { container } = renderSplit(onPrimary, onSchedule);

  fireEvent.tap(requireElement(container.querySelector('[accessibility-label="Publish"]')));

  expect(onPrimary).toHaveBeenCalledTimes(1);
  expect(onSchedule).not.toHaveBeenCalled();
});

test("the caret opens the menu and its item runs the secondary action", async () => {
  const onPrimary = rstest.fn();
  const onSchedule = rstest.fn();
  const { container, findByText, getByText, queryByText } = renderSplit(onPrimary, onSchedule);

  const caret = layoutCaret(container);
  expect(queryByText("Schedule")).toBeNull();

  fireEvent.tap(caret);
  expect(await findByText("Schedule")).toBeInTheDocument();

  fireEvent.tap(getByText("Schedule"));

  expect(onSchedule).toHaveBeenCalledTimes(1);
  expect(onPrimary).not.toHaveBeenCalled();
  expect(queryByText("Schedule")).toBeNull();
});

test("a disabled pill runs neither half and never opens the menu", async () => {
  const onPrimary = rstest.fn();
  const onSchedule = rstest.fn();
  const { container, queryByText } = renderSplit(onPrimary, onSchedule, true);

  const caret = layoutCaret(container);
  fireEvent.tap(requireElement(container.querySelector('[accessibility-label="Publish"]')));
  fireEvent.tap(caret);

  expect(onPrimary).not.toHaveBeenCalled();
  expect(onSchedule).not.toHaveBeenCalled();
  expect(queryByText("Schedule")).toBeNull();
});

test("a passed style reaches the pill container", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <SplitButton aria-label="Publish" style={{ marginTop: "7px" }}>
        Publish
      </SplitButton>
    </HoronProvider>,
  );

  expect(requireElement(container.querySelector('[accessibility-label="Publish"]')).parentElement).toHaveStyle({ marginTop: "7px" });
});
