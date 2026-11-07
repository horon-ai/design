import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Card } from "../../src/components/card";
import { HoronProvider } from "../../src/provider";

test("tapping an interactive card runs its tap handler", async () => {
  let taps = 0;
  const { container, findByText } = render(
    <HoronProvider>
      <Card title="Chief of staff" description="Morning brief is ready." interactive onTap={() => (taps += 1)} />
    </HoronProvider>,
  );

  await findByText("Chief of staff");
  fireEvent.tap(container.querySelector(".rounded-xl")!);
  expect(taps).toBe(1);
});

test("a card without onTap has no press target and no caret", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Card title="Inbox Manager" description="6 emails need you." />
    </HoronProvider>,
  );

  await findByText("Inbox Manager");
  const root = container.querySelector(".rounded-xl");
  expect(root?.getAttribute("bindtap")).toBeNull();
  expect(root?.getAttribute("accessibility-traits")).toBeNull();
  // The caret is only drawn for interactive cards.
  expect(container.querySelector("svg")).toBeNull();
});

test("the interactive caret renders when a card opens something", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Card title="Chief of staff" interactive onTap={() => undefined} />
    </HoronProvider>,
  );

  await findByText("Chief of staff");
  expect(container.querySelector("svg")).not.toBeNull();
});
