import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Spinner } from "../../src/components/spinner";
import { HoronProvider } from "../../src/provider";

test("Spinner paints the ink track and the brand arc at the rung's pixel size", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Spinner size="md" label="Saving" />
    </HoronProvider>,
  );

  const glyph = container.querySelector('[accessibility-role-description="progressbar"]')!;
  const content = glyph.getAttribute("content")!;

  // Light scheme: 10% ink track, primary ink arc, both substituted into the SVG
  // string because `<svg content>` cannot read CSS variables.
  expect(content).toContain('stroke="#0000001a"');
  expect(content).toContain('stroke="#17181a"');
  expect(glyph.getAttribute("accessibility-label")).toBe("Saving");
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector('[style="width: 24px; height: 24px;"]')).not.toBeNull();
});

test("a raw pixel size overrides the named rung, and the label defaults to Loading", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Spinner size={12} />
    </HoronProvider>,
  );

  const glyph = container.querySelector('[accessibility-role-description="progressbar"]')!;
  expect(glyph.getAttribute("accessibility-label")).toBe("Loading");
  expect(container.querySelector('[style="width: 12px; height: 12px;"]')).not.toBeNull();
});
