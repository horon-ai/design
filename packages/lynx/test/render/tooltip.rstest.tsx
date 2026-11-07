import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

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

/** Two siblings in one provider, the shape Base UI's delay group was built for. */
const renderPair = (timeout: number) =>
  render(
    <HoronProvider scheme="light">
      <TooltipProvider delay={600} timeout={timeout}>
        <Tooltip label="First hint">
          <view>
            <text>first</text>
          </view>
        </Tooltip>
        <Tooltip label="Second hint">
          <view>
            <text>second</text>
          </view>
        </Tooltip>
      </TooltipProvider>
    </HoronProvider>,
  );

/** Both triggers of `renderPair`, each pre-measured so the bubble can be placed. */
const pairTriggers = (container: Element) => {
  const triggers = Array.from(container.querySelectorAll('[accessibility-traits="button"]'));
  if (triggers.length !== 2) throw new Error("expected two tooltip triggers");
  for (const trigger of triggers) {
    fireEvent.layoutchange(trigger, { detail: { left: 100, top: 200, width: 40, height: 40 } });
  }
  return triggers;
};

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

test("the next tooltip in the group opens instantly within the timeout", async () => {
  const { container, findByText, queryByText } = renderPair(400);
  const [first, second] = pairTriggers(container);

  fireEvent.tap(first);
  expect(await findByText("First hint")).toBeInTheDocument();

  fireEvent.tap(requireElement(container.querySelector(".fixed")));
  expect(queryByText("First hint")).toBeNull();

  // The sibling closed a moment ago, so the 600ms delay is skipped entirely.
  fireEvent.tap(second);
  expect(queryByText("Second hint")).not.toBeNull();
});

test("reopening the same bubble keeps its delay, since only a sibling starts the instant phase", async () => {
  rstest.useFakeTimers();
  try {
    const { container, queryByText } = renderPair(400);
    const [first] = pairTriggers(container);

    fireEvent.tap(first);
    await act(() => {
      rstest.advanceTimersByTime(600);
    });
    expect(queryByText("First hint")).not.toBeNull();

    fireEvent.tap(requireElement(container.querySelector(".fixed")));
    expect(queryByText("First hint")).toBeNull();

    fireEvent.tap(first);
    expect(queryByText("First hint")).toBeNull();

    await act(() => {
      rstest.advanceTimersByTime(600);
    });
    expect(queryByText("First hint")).not.toBeNull();
  } finally {
    await act(() => {
      rstest.useRealTimers();
    });
  }
});

test("the instant phase expires after the timeout and the delay applies again", async () => {
  // Fake timers make both the delay and the instant-phase expiry deterministic; the queries stay
  // synchronous because the testing library's async `findBy*` pollers run on the faked clock.
  rstest.useFakeTimers();
  try {
    const { container, queryByText } = renderPair(400);
    const [first, second] = pairTriggers(container);

    fireEvent.tap(first);
    await act(() => {
      rstest.advanceTimersByTime(600);
    });
    expect(queryByText("First hint")).not.toBeNull();

    fireEvent.tap(requireElement(container.querySelector(".fixed")));
    expect(queryByText("First hint")).toBeNull();

    await act(() => {
      rstest.advanceTimersByTime(401);
    });

    fireEvent.tap(second);
    expect(queryByText("Second hint")).toBeNull();

    await act(() => {
      rstest.advanceTimersByTime(600);
    });
    expect(queryByText("Second hint")).not.toBeNull();
  } finally {
    await act(() => {
      rstest.useRealTimers();
    });
  }
});
