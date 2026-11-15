import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Button } from "../../src/components/button";
import { FilterBar } from "../../src/components/filter-bar";
import { IconButton } from "../../src/components/icon-button";
import { Tabs, TabsList, TabsTab } from "../../src/components/tabs";
import { HoronProvider, useHoronTheme } from "../../src/provider";

/**
 * `touch` is the host's statement that a fingertip is the pointer. These tests pin the
 * two halves of that contract: the rung adds a 44px box, and leaving it off changes
 * nothing, so a desktop tree keeps the sizes the design draws.
 */

/** Reads the theme flag from inside the tree, the way a component reads it. */
function TouchProbe() {
  const { touch } = useHoronTheme();
  return <text>touch {String(touch)}</text>;
}

test("touch is off unless the host asks for it", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <TouchProbe />
    </HoronProvider>,
  );

  expect(container.textContent).toContain("touch false");
});

test("the provider exposes the touch rung through theme context", () => {
  const { container } = render(
    <HoronProvider scheme="light" touch>
      <TouchProbe />
    </HoronProvider>,
  );

  expect(container.textContent).toContain("touch true");
});

test("a Button grows to the 44px box under touch and keeps its desktop rung without it", () => {
  const desktop = render(
    <HoronProvider scheme="light">
      <Button>Save</Button>
    </HoronProvider>,
  );
  const desktopButton = desktop.container.querySelector(".bg-interactive-primary")!;
  expect(desktopButton.className).toContain("h-10");
  expect(desktopButton.className).not.toContain("h-11");

  const touch = render(
    <HoronProvider scheme="light" touch>
      <Button>Save</Button>
    </HoronProvider>,
  );
  const touchButton = touch.container.querySelector(".bg-interactive-primary")!;
  // tailwind-merge keeps one height class: the rung replaces the desktop one.
  expect(touchButton.className).toContain("h-11");
  expect(touchButton.className).not.toContain("h-10");
});

test("an IconButton grows both dimensions, since its disc is under 44 in both", () => {
  const touch = render(
    <HoronProvider scheme="light" touch>
      <IconButton label="Close" icon={<text>X</text>} />
    </HoronProvider>,
  );
  const button = touch.container.querySelector("[accessibility-label='Close']")!;
  expect(button.className).toContain("size-11");
});

test("a pill TabsTab grows to 44 while the underline tab keeps its text row", () => {
  const touch = render(
    <HoronProvider scheme="light" touch>
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTab value="a">Alpha</TabsTab>
        </TabsList>
      </Tabs>
    </HoronProvider>,
  );
  const tab = touch.container.querySelector("[accessibility-role-description='tab']")!;
  expect(tab.className).toContain("h-11");

  const underline = render(
    <HoronProvider scheme="light" touch>
      <Tabs defaultValue="a">
        <TabsList variant="underline">
          <TabsTab value="a">Alpha</TabsTab>
        </TabsList>
      </Tabs>
    </HoronProvider>,
  );
  const underlineTab = underline.container.querySelector("[accessibility-role-description='tab']")!;
  // The underline tab is a text row in a column, not a pill; growing it would break the rule under it.
  expect(underlineTab.className).not.toContain("h-11");
});

test("a FilterBar option grows but the track is still a 3px-padded hug", () => {
  const touch = render(
    <HoronProvider scheme="light" touch>
      <FilterBar items={[{ value: "all", label: "All" }]} />
    </HoronProvider>,
  );
  const option = touch.container.querySelector("[accessibility-role-description='radio']")!;
  expect(option.className).toContain("h-11");

  const track = touch.container.querySelector("[accessibility-role-description='radiogroup']")!;
  // The track sets no height, so it follows the taller option instead of clipping it.
  expect(track.className).toContain("p-[3px]");
  expect(track.className).not.toContain("h-[50px]");
});
