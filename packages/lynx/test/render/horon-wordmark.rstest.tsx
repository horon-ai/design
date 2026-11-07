import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { HoronWordmark } from "../../src/components/horon-wordmark";
import { HoronProvider } from "../../src/provider";

/** The markup the component hands to Lynx's `<svg content>` element. */
const contentOf = (container: HTMLElement): string => container.querySelector("svg")?.getAttribute("content") ?? "";

test("the wordmark draws all six letter paths in the primary ink", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <HoronWordmark />
    </HoronProvider>,
  );

  const content = contentOf(container);
  expect(content.match(/<path d="/g)?.length).toBe(6);
  expect(content).toContain('viewBox="0 0 48.7038 11.5"');
  expect(content).toContain('fill="#17181a"');
});

test("a numeric height scales the width by the drawing's aspect ratio", () => {
  const { container } = render(
    <HoronProvider>
      <HoronWordmark height={23} />
    </HoronProvider>,
  );
  const wrapper = container.querySelector("svg")?.parentElement;
  expect(wrapper?.style.height).toBe("23px");
  expect(wrapper?.style.width).toBe(`${23 * (48.7038 / 11.5)}px`);
});

test("the accessible name defaults to Horon and follows the title prop", () => {
  const defaulted = render(
    <HoronProvider>
      <HoronWordmark />
    </HoronProvider>,
  );
  expect(defaulted.container.querySelector('[accessibility-label="Horon"]')).not.toBeNull();

  const named = render(
    <HoronProvider>
      <HoronWordmark title="Horon home" />
    </HoronProvider>,
  );
  expect(named.container.querySelector('[accessibility-label="Horon home"]')).not.toBeNull();
});

test("the dark scheme swaps the ink so the mark stays visible", () => {
  const { container } = render(
    <HoronProvider scheme="dark">
      <HoronWordmark />
    </HoronProvider>,
  );
  expect(contentOf(container)).not.toContain('fill="#17181a"');
});

test("a CSS length height is passed through and leaves the width to the caller", () => {
  const { container } = render(
    <HoronProvider>
      <HoronWordmark height="1em" width={40} />
    </HoronProvider>,
  );
  const wrapper = container.querySelector("svg")?.parentElement;
  expect(wrapper?.style.height).toBe("1em");
  expect(wrapper?.style.width).toBe("40px");
});
