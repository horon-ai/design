import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Badge } from "../../src/components/badge";
import { HoronProvider } from "../../src/provider";

test("a Badge paints its tone, its label and an optional status dot", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <Badge tone="brand" dot>
          Running
        </Badge>
        <Badge tone="danger">Failed</Badge>
      </view>
    </HoronProvider>,
  );

  const pills = container.querySelectorAll('[accessibility-role-description="text"]');
  expect(pills.length).toBe(2);

  const [brand, danger] = pills;
  expect(brand.textContent).toContain("Running");
  expect(brand.className).toContain("bg-accent-sky-500-18");
  expect(brand.querySelector(".bg-status-live")).not.toBeNull();

  expect(danger.textContent).toContain("Failed");
  expect(danger.className).toContain("bg-accent-red-500-14");
  // No dot requested: the pill carries only the label.
  expect(danger.querySelector(".bg-text-danger")).toBeNull();
});

test("the three Badge rungs differ in height and label rung", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <Badge size="sm">sm</Badge>
        <Badge size="md">md</Badge>
        <Badge size="lg">lg</Badge>
      </view>
    </HoronProvider>,
  );

  const pills = [...container.querySelectorAll('[accessibility-role-description="text"]')];
  expect(pills.map((pill) => pill.className.includes("h-5 "))).toEqual([true, false, false]);
  expect(pills[1].className).toContain("h-[22px]");
  expect(pills[2].className).toContain("h-[26px]");
  expect(pills[0].textContent).toContain("sm");
});
