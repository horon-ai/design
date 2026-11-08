import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "../../src/components/menu";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** A trigger with a stable id so the layout event can be addressed in the test. */
const renderMenu = (onSelect = rstest.fn()) =>
  render(
    <HoronProvider scheme="light">
      <Menu>
        <MenuTrigger>
          <text>Account</text>
        </MenuTrigger>
        <MenuContent>
          <MenuLabel>mina@horon.ai</MenuLabel>
          <MenuItem onClick={() => onSelect("profile")}>Profile</MenuItem>
          <MenuItem disabled onClick={() => onSelect("blocked")}>
            Disabled row
          </MenuItem>
        </MenuContent>
      </Menu>
    </HoronProvider>,
  );

/** Fires the trigger's layout reading so the popup has an anchor to place itself against. */
const layoutTrigger = (element: Element) => {
  fireEvent.layoutchange(element, { detail: { left: 20, top: 40, width: 120, height: 32 } });
};

test("the trigger opens the menu and an item tap calls onSelect and closes it", async () => {
  const onSelect = rstest.fn();
  const { findByText, getByText, queryByText } = renderMenu(onSelect);

  const triggerText = await findByText("Account");
  const trigger = requireElement(triggerText.parentElement);
  layoutTrigger(trigger);

  expect(queryByText("mina@horon.ai")).toBeNull();

  fireEvent.tap(trigger);
  expect(await findByText("mina@horon.ai")).toBeInTheDocument();

  fireEvent.tap(getByText("Profile"));
  expect(onSelect).toHaveBeenCalledWith("profile");
  expect(queryByText("mina@horon.ai")).toBeNull();
});

test("a disabled item ignores the tap and keeps the menu open", async () => {
  const onSelect = rstest.fn();
  const { findByText, getByText } = renderMenu(onSelect);

  const trigger = requireElement((await findByText("Account")).parentElement);
  layoutTrigger(trigger);
  fireEvent.tap(trigger);

  fireEvent.tap(await findByText("Disabled row"));

  expect(onSelect).not.toHaveBeenCalled();
  expect(getByText("mina@horon.ai")).toBeInTheDocument();
});

test("an outside tap dismisses the menu without picking an item", async () => {
  const onSelect = rstest.fn();
  const { container, findByText, queryByText } = renderMenu(onSelect);

  const trigger = requireElement((await findByText("Account")).parentElement);
  layoutTrigger(trigger);
  fireEvent.tap(trigger);
  expect(await findByText("mina@horon.ai")).toBeInTheDocument();

  const backdrop = requireElement(container.querySelector(".fixed"));
  fireEvent.tap(backdrop);

  expect(queryByText("mina@horon.ai")).toBeNull();
  expect(onSelect).not.toHaveBeenCalled();
});

test("an inline-start side opens the popup on the anchor's left", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Menu>
        <MenuTrigger>
          <text>Account</text>
        </MenuTrigger>
        <MenuContent side="inline-start">
          <MenuItem>Profile</MenuItem>
        </MenuContent>
      </Menu>
    </HoronProvider>,
  );

  const trigger = requireElement((await findByText("Account")).parentElement);
  layoutTrigger(trigger);
  fireEvent.tap(trigger);

  // The inline start resolves to the physical left branch: the popup starts at the anchor's own top
  // (40) instead of the 80 a bottom placement would use, and it never sets `left`.
  const popup = requireElement(container.querySelector(".z-50"));
  const style = popup.getAttribute("style") ?? "";
  expect(style).toContain("top: 40px");
  expect(style).not.toContain("top: 80px");
  expect(style).not.toContain("left:");
});

test("a vertical separator draws a column rule instead of a row rule", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <MenuSeparator orientation="vertical" />
    </HoronProvider>,
  );

  const separator = requireElement(container.querySelector("[accessibility-role-description='separator']"));
  const rule = requireElement(separator.firstElementChild);
  expect(separator.getAttribute("class")).toContain("h-4");
  expect(rule.getAttribute("class")).toContain("w-px");
  expect(rule.getAttribute("class")).not.toContain("h-px");
});

test("caller styles, ids and the popup placement land on their own parts", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <Menu>
        <MenuTrigger>
          <text>Account</text>
        </MenuTrigger>
        <MenuContent id="account-menu" style={{ width: "200px" }}>
          <MenuItem id="profile-row" style={{ opacity: "0.5" }}>
            Profile
          </MenuItem>
          <MenuSeparator style={{ width: "120px" }} />
        </MenuContent>
      </Menu>
    </HoronProvider>,
  );

  const trigger = requireElement((await findByText("Account")).parentElement);
  layoutTrigger(trigger);
  fireEvent.tap(trigger);

  const popup = requireElement(container.querySelector("#account-menu"));
  expect(popup.getAttribute("style")).toContain("width: 200px");
  // The placement still applies: the popup keeps the anchor's top offset next to the caller's width.
  expect(popup.getAttribute("style")).toContain("top: 80px");
  expect(requireElement(container.querySelector("#profile-row")).getAttribute("style")).toContain("opacity: 0.5");
  expect(requireElement(container.querySelector("[accessibility-role-description='separator']")).getAttribute("style")).toContain("width: 120px");
});

test("a closed menu renders no popup content", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Menu>
        <MenuTrigger>
          <text>Account</text>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Profile</MenuItem>
        </MenuContent>
      </Menu>
    </HoronProvider>,
  );

  expect(container.textContent).not.toContain("Profile");
});
