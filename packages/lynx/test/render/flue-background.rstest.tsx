import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { FLUE_NIGHT, FLUE_SKY, FlueBackground } from "../../src/components/flue-background";
import { HoronProvider } from "../../src/provider";

/** The `rgb()` form a browser engine reports for a palette hex, since inline styles normalise. */
const rgb = (hex: string): string => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`;
};

/** The painted gradient layers of one render, found by the ramp they carry inline. */
const plumes = (container: HTMLElement): SVGViewElement[] =>
  [...container.querySelectorAll("view")].filter((element) =>
    element.style.backgroundImage.includes("linear-gradient"),
  );

test("the smoke is decorative: it renders no text at all", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view className="relative h-[200px] w-full">
        <FlueBackground />
      </view>
    </HoronProvider>,
  );

  expect(container.textContent).toBe("");
  expect(plumes(container).length).toBeGreaterThanOrEqual(3);
});

test("the wrapper paints the palette ground before any layer", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view className="relative h-[200px] w-full">
        <FlueBackground />
      </view>
    </HoronProvider>,
  );

  const wrapper = [...container.querySelectorAll("view")].find((element) => element.style.backgroundColor !== "");
  expect(wrapper).toBeDefined();
  expect(wrapper?.style.backgroundColor).toBe(rgb(FLUE_SKY.bgColor));
  // The ramps stop at the sky palette's densest colour, so a light render uses the sky blue, not the night one.
  const ramps = plumes(container).map((element) => element.style.backgroundImage);
  expect(ramps.some((ramp) => ramp.includes(rgb(FLUE_SKY.colorD)))).toBe(true);
  expect(ramps.some((ramp) => ramp.includes(rgb(FLUE_NIGHT.colorD)))).toBe(false);
});

test("reduced motion freezes the plumes instead of animating them", () => {
  const moving = render(
    <HoronProvider scheme="light">
      <view className="relative h-[200px] w-full">
        <FlueBackground />
      </view>
    </HoronProvider>,
  );
  const still = render(
    <HoronProvider scheme="light" reducedMotion>
      <view className="relative h-[200px] w-full">
        <FlueBackground />
      </view>
    </HoronProvider>,
  );

  expect(plumes(moving.container)[0].style.animationName).toBe("flue-rise");
  expect(plumes(still.container)[0].style.animationName).toBe("");
});

test("the bloom pulses under its tuned opacity instead of replacing it", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view className="relative h-[200px] w-full">
        <FlueBackground variant="sidebar" />
      </view>
    </HoronProvider>,
  );

  const bloom = plumes(container).find((element) => element.style.animationName === "flue-glow");
  expect(bloom).toBeDefined();
  // An animated opacity would override an inline one, so the tuned ceiling must live on the parent.
  expect(bloom?.style.opacity).toBe("");
  const ceiling = bloom?.parentElement;
  expect(ceiling instanceof HTMLElement ? Number(ceiling.style.opacity) : Number.NaN).toBeCloseTo(0.15, 5);
});

test("a variant tint is laid over the smoke unless the caller replaces it", () => {
  const tinted = render(
    <HoronProvider scheme="light">
      <view className="relative h-[200px] w-full">
        <FlueBackground variant="sidebar" />
      </view>
    </HoronProvider>,
  );
  const plain = render(
    <HoronProvider scheme="light">
      <view className="relative h-[200px] w-full">
        <FlueBackground variant="sidebar" tintClassName="" />
      </view>
    </HoronProvider>,
  );

  expect(tinted.container.querySelector(".bg-glass-thick")).not.toBeNull();
  expect(plain.container.querySelector(".bg-glass-thick")).toBeNull();
});
