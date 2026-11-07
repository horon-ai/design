import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Skeleton, SkeletonCard } from "../../src/components/skeleton";
import { HoronProvider } from "../../src/provider";

/** Every placeholder bar in a rendered card, counted by the ink token they all paint with. */
const bars = (container: HTMLElement): NodeListOf<Element> => container.querySelectorAll(".bg-overlay-ink-7");

test("the row card is an avatar pill plus two lines", () => {
  const { container } = render(
    <HoronProvider>
      <SkeletonCard type="row" />
    </HoronProvider>,
  );
  expect(bars(container).length).toBe(3);
  expect(container.querySelectorAll(".rounded-full").length).toBeGreaterThanOrEqual(1);
  expect(container.textContent).toBe("");
});

test("the card placeholder stacks five bars and the text placeholder only three", () => {
  const card = render(
    <HoronProvider>
      <SkeletonCard type="card" />
    </HoronProvider>,
  );
  expect(bars(card.container).length).toBe(5);

  const text = render(
    <HoronProvider>
      <SkeletonCard type="text" />
    </HoronProvider>,
  );
  expect(bars(text.container).length).toBe(3);
});

test("a solid card paints no glass layer, a glass card does", () => {
  const solid = render(
    <HoronProvider>
      <SkeletonCard surface="solid" />
    </HoronProvider>,
  );
  expect(solid.container.querySelectorAll(".liquid-layers").length).toBe(0);

  const glass = render(
    <HoronProvider>
      <SkeletonCard surface="glass" />
    </HoronProvider>,
  );
  expect(glass.container.querySelectorAll(".liquid-layers").length).toBe(1);
});

test("the card announces itself once and hides its bars from assistive tech", () => {
  const { container } = render(
    <HoronProvider>
      <SkeletonCard />
    </HoronProvider>,
  );
  const status = container.querySelector('[accessibility-label="Loading"]');
  expect(status).not.toBeNull();
  for (const bar of bars(container)) {
    expect(bar.hasAttribute("accessibility-elements-hidden")).toBe(true);
  }
});

test("a bare skeleton takes the shape it is given and carries no content", () => {
  const block = render(
    <HoronProvider>
      <Skeleton className="h-3 w-40" />
    </HoronProvider>,
  );
  const blockEl = block.container.querySelector(".bg-overlay-ink-7");
  expect(blockEl?.getAttribute("class")).toContain("rounded-xs");

  const pill = render(
    <HoronProvider>
      <Skeleton shape="pill" />
    </HoronProvider>,
  );
  expect(pill.container.querySelector(".bg-overlay-ink-7")?.getAttribute("class")).toContain("rounded-full");
  expect(pill.container.textContent).toBe("");
});
