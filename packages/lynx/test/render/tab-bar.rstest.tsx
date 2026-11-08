import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Icon } from "../../src/icons";
import { TabBar, type TabBarItem } from "../../src/components/tab-bar";
import { HoronProvider } from "../../src/provider";

const items: TabBarItem[] = [
  { value: "home", label: "Home", icon: <Icon name="House" size={22} /> },
  { value: "search", label: "Search", icon: <Icon name="MagnifyingGlass" size={22} /> },
  { value: "me", label: "Me", icon: <Icon name="User" size={22} /> },
];

/** The tab whose accessible name matches. */
const tabByName = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) => element.getAttribute("accessibility-label") === label,
  );
  if (!node) throw new Error(`no tab named ${label}`);
  return node;
};

test("tapping a destination reports its value and marks only the current one", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <TabBar items={items} value="home" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  expect(tabByName(container, "Home").getAttribute("accessibility-value")).toBe("selected");
  expect(tabByName(container, "Search").getAttribute("accessibility-value")).toBeNull();

  fireEvent.tap(tabByName(container, "Search"));

  expect(onValueChange).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith("search");
});

test("the bar is controlled: the selection does not move without a new value", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <TabBar items={items} value="home" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  fireEvent.tap(tabByName(container, "Me"));

  expect(tabByName(container, "Home").getAttribute("accessibility-value")).toBe("selected");
  expect(tabByName(container, "Me").getAttribute("accessibility-value")).toBeNull();
});

test("an empty item list renders no tabs and no indicator box", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <TabBar items={[]} value="home" />
    </HoronProvider>,
  );

  expect(container.querySelectorAll('[accessibility-label="Home"]').length).toBe(0);
  expect(container.querySelector(".motion-indicator")).toBeNull();
});

test("the glass surface draws the rim layer and flat omits it", () => {
  const glass = render(
    <HoronProvider scheme="light">
      <TabBar items={items} value="home" />
    </HoronProvider>,
  );
  expect(glass.container.querySelectorAll(".liquid-layers").length).toBeGreaterThan(0);

  const flat = render(
    <HoronProvider scheme="light">
      <TabBar items={items} value="home" surface="flat" />
    </HoronProvider>,
  );
  expect(flat.container.querySelectorAll(".liquid-layers").length).toBe(0);
});
