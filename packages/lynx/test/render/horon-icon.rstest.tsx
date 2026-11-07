import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { HoronGlyph, HoronIcon, iconNames } from "../../src/components/horon-icon";
import { HoronProvider } from "../../src/provider";

/** The markup the component hands to Lynx's `<svg content>` element. */
const contentOf = (container: HTMLElement): string => container.querySelector("svg")?.getAttribute("content") ?? "";

test("the Horon mark is one filled path in the primary ink", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <HoronIcon />
    </HoronProvider>,
  );

  const content = contentOf(container);
  expect(content.match(/<path d="/g)?.length).toBe(1);
  expect(content).toContain('viewBox="0 0 22 22"');
  expect(content).toContain('fill="#17181a"');
});

test("a numeric size sets both axes and the mark stays out of the accessibility tree", () => {
  const { container } = render(
    <HoronProvider>
      <HoronIcon size={22} />
    </HoronProvider>,
  );
  const wrapper = container.querySelector("svg")?.parentElement;
  expect(wrapper?.style.width).toBe("22px");
  expect(wrapper?.style.height).toBe("22px");
  expect(wrapper?.hasAttribute("accessibility-elements-hidden")).toBe(true);
});

test("a glyph name resolves to its phosphor artwork rather than the Horon mark", () => {
  const mark = render(
    <HoronProvider>
      <HoronIcon size={20} />
    </HoronProvider>,
  );
  const sparkles = render(
    <HoronProvider>
      <HoronGlyph name="sparkles" size={20} />
    </HoronProvider>,
  );

  const glyph = contentOf(sparkles.container);
  expect(glyph.length).toBeGreaterThan(0);
  expect(glyph).not.toBe(contentOf(mark.container));
});

test("the horon name resolves to the Horon mark, not to a phosphor glyph", () => {
  const registry = render(
    <HoronProvider>
      <HoronGlyph name="horon" size={24} />
    </HoronProvider>,
  );
  const direct = render(
    <HoronProvider>
      <HoronIcon size={24} />
    </HoronProvider>,
  );
  expect(contentOf(registry.container)).toBe(contentOf(direct.container));
});

test("a length size keeps its pixels and the registry keeps Paper's order", () => {
  const { container } = render(
    <HoronProvider>
      <HoronGlyph name="plus" size="24px" />
    </HoronProvider>,
  );
  const wrapper = container.querySelector("svg")?.parentElement;
  expect(wrapper?.style.width).toBe("24px");

  expect(iconNames.length).toBe(79);
  expect(iconNames[0]).toBe("plus");
  expect(iconNames.at(-1)).toBe("plus-circle");
  expect(iconNames.includes("horon")).toBe(true);
});
