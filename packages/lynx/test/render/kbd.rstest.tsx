import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Kbd } from "../../src/components/kbd";
import { HoronProvider } from "../../src/provider";

test("Kbd draws the OS label of a `keys` shortcut and trims the chip", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Kbd keys="Mod+Enter" />
    </HoronProvider>,
  );

  const chip = container.querySelector('[accessibility-role-description="text"]')!;
  // The test host reports no SystemInfo.platform, so the OS is `unknown` and the
  // Mac symbols are drawn — the same neutral default React used before hydration.
  expect(chip.textContent).toBe("⌘↵");
  expect(chip.className).toContain("bg-overlay-ink-6");
  expect(chip.className).toContain("h-5");
});

test("Kbd without `keys` renders its children, so several chips compose one shortcut", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="lg">K</Kbd>
      </view>
    </HoronProvider>,
  );

  const chips = [...container.querySelectorAll('[accessibility-role-description="text"]')];
  expect(chips.map((chip) => chip.textContent)).toEqual(["⌘", "K"]);
  expect(chips[0].className).toContain("h-4");
  expect(chips[1].className).toContain("h-6");
  expect(chips[1].className).toContain("text-label-sm");
});
