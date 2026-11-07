import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { MenuItem } from "../../src/components/menu";
import { PluginRow } from "../../src/components/plugin-row";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** The switch is the only switch-role control in the row. */
const control = (container: HTMLElement): Element => {
  const found = container.querySelector("[accessibility-role-description='switch']");
  if (!found) throw new Error("no switch in the tree");
  return found;
};

test("the switch reports the next state and the overflow menu reports its picked item", async () => {
  const onEnabledChange = rstest.fn();
  const onUpdate = rstest.fn();
  const onSelect = rstest.fn();
  const { container, findByText, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <PluginRow
        initials="GH"
        name="GitHub tools"
        version="v1.4.0"
        updateBadge="Update available"
        author="by Horon Labs"
        verified
        chips={[{ id: "repos", label: "Repos" }]}
        enabled
        onEnabledChange={onEnabledChange}
        onUpdate={onUpdate}
        menu={<MenuItem onClick={() => onSelect("details")}>Details</MenuItem>}
      />
    </HoronProvider>,
  );

  fireEvent.tap(control(container));
  expect(onEnabledChange).toHaveBeenCalledWith(false);

  fireEvent.tap(await findByText("Update"));
  expect(onUpdate).toHaveBeenCalledTimes(1);

  const trigger = requireElement(requireElement(container.querySelector("[accessibility-label='More']")).parentElement);
  fireEvent.layoutchange(trigger, { detail: { left: 8, top: 8, width: 32, height: 32 } });
  fireEvent.tap(trigger);

  fireEvent.tap(await findByText("Details"));
  expect(onSelect).toHaveBeenCalledWith("details");
  expect(queryByText("Details")).toBeNull();
  expect(getByText("Repos")).toBeInTheDocument();
});

test("a plugin with no update and no menu shows neither the Update button nor the overflow button", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <PluginRow initials="DB" name="Database console" version="v0.9.2" author="by Community" enabled={false} />
    </HoronProvider>,
  );

  expect(await findByText("Database console")).toBeInTheDocument();
  expect(container.textContent).not.toContain("Update");
  expect(container.querySelector("[accessibility-label='More']")).toBeNull();
  expect(control(container).getAttribute("accessibility-value")).toBe("unchecked");
});
