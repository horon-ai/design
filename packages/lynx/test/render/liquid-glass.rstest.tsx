import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { LiquidGlass } from "../../src/components/liquid-glass";
import { HoronProvider } from "../../src/provider";

/**
 * Proves the render harness works: a Lynx tree mounts under the provider, the
 * rim layer paints two views with the class names `globals.css` styles, and the
 * host's own class list is untouched.
 */
test("LiquidGlass renders the rim layer inside a glass host", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <view className="relative overflow-hidden rounded-xl bg-glass-regular">
        <LiquidGlass />
        <text>frost</text>
      </view>
    </HoronProvider>,
  );

  expect(await findByText("frost")).toBeInTheDocument();

  const layers = container.querySelectorAll(".liquid-layers");
  expect(layers.length).toBe(1);
  expect(layers[0].querySelectorAll(".liquid-layers-inner").length).toBe(1);
});

test("LiquidGlass renders no text of its own", () => {
  const { container } = render(<LiquidGlass />);
  expect(container.textContent).toBe("");
});
