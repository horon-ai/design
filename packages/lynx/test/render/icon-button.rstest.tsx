import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { IconButton } from "../../src/components/icon-button";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

/** A toolbar whose selection is visible in its text, so the tap result is observable. */
function Toolbar() {
  const [selected, setSelected] = useState("none");
  return (
    <view>
      <IconButton icon={<Icon name="Plus" />} label="Add" onClick={() => setSelected("add")} />
      <IconButton icon={<Icon name="MagnifyingGlass" />} label="Search" onClick={() => setSelected("search")} />
      <text>selected {selected}</text>
    </view>
  );
}

test("tapping an IconButton runs its handler and the label names it", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Toolbar />
    </HoronProvider>,
  );

  const [add, search] = container.querySelectorAll('[accessibility-element="true"]');
  expect(add.getAttribute("accessibility-label")).toBe("Add");
  expect(search.getAttribute("accessibility-label")).toBe("Search");
  expect(container.textContent).toContain("selected none");

  fireEvent.tap(search);
  expect(container.textContent).toContain("selected search");
});

test("a disabled IconButton stays inert", () => {
  let calls = 0;
  const { container } = render(
    <HoronProvider scheme="light">
      <IconButton icon={<Icon name="Plus" />} label="Add" disabled onClick={() => (calls += 1)} />
    </HoronProvider>,
  );

  const button = container.querySelector('[accessibility-label="Add"]')!;
  expect(button.getAttribute("accessibility-traits")).toBe("disabled");
  expect(button.className).toContain("opacity-40");

  fireEvent.tap(button);
  expect(calls).toBe(0);
});

test("the glass variant carries the rim layer and the glyph takes the rung size", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <IconButton variant="glass" size="lg" icon={<Icon name="Plus" />} label="Add large" />
    </HoronProvider>,
  );

  const button = container.querySelector('[accessibility-label="Add large"]')!;
  expect(button.querySelectorAll(".liquid-layers").length).toBe(1);
  expect(button.className).toContain("bg-glass-clear");
  expect(container.querySelector('[style="width: 24px; height: 24px;"]')).not.toBeNull();
});
