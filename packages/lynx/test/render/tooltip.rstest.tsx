import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Tooltip, TooltipProvider } from "../../src/components/tooltip";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

const renderTooltip = () =>
  render(
    <HoronProvider scheme="light">
      <TooltipProvider delay={0}>
        <Tooltip label="Copy link">
          <view>
            <text>trigger</text>
          </view>
        </Tooltip>
      </TooltipProvider>
    </HoronProvider>,
  );

test("a tap opens the bubble and a second tap on the backdrop closes it", async () => {
  const { container, findByText, queryByText } = renderTooltip();

  const trigger = requireElement(container.querySelector('[accessibility-traits="button"]'));
  fireEvent.layoutchange(trigger, { detail: { left: 100, top: 200, width: 40, height: 40 } });

  expect(queryByText("Copy link")).toBeNull();

  fireEvent.tap(trigger);
  expect(await findByText("Copy link")).toBeInTheDocument();

  const backdrop = requireElement(container.querySelector(".fixed"));
  fireEvent.tap(backdrop);
  expect(queryByText("Copy link")).toBeNull();
});

test("a long press opens the bubble on touch, where there is no hover", async () => {
  const { container, findByText } = renderTooltip();
  await findByText("trigger");

  const trigger = requireElement(container.querySelector('[accessibility-traits="button"]'));
  fireEvent.layoutchange(trigger, { detail: { left: 100, top: 200, width: 40, height: 40 } });
  fireEvent.longpress(trigger);

  expect(await findByText("Copy link")).toBeInTheDocument();
});

test("a closed tooltip renders only its trigger", async () => {
  const { container, findByText } = renderTooltip();

  expect(await findByText("trigger")).toBeInTheDocument();
  expect(container.textContent).toBe("trigger");
});
