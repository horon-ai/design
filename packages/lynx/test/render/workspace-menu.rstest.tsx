import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { WorkspaceMenu } from "../../src/components/workspace-menu";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members" },
  { id: "labs", name: "Horon Labs", meta: "4 members" },
];

const renderWorkspaceMenu = (onValueChange = rstest.fn()) =>
  render(
    <HoronProvider scheme="light">
      <WorkspaceMenu
        workspaces={workspaces}
        value="hq"
        onValueChange={onValueChange}
        onCreate={rstest.fn()}
        onSettings={rstest.fn()}
        trigger={<view />}
        triggerChildren={<text>Horon HQ</text>}
      />
    </HoronProvider>,
  );

test("the trigger lists every workspace and picking one reports its id", async () => {
  const onValueChange = rstest.fn();
  const { findByText, getByText } = renderWorkspaceMenu(onValueChange);

  const trigger = requireElement((await findByText("Horon HQ")).parentElement);
  fireEvent.layoutchange(trigger, { detail: { left: 8, top: 8, width: 200, height: 36 } });
  fireEvent.tap(trigger);

  expect(await findByText("Workspaces")).toBeInTheDocument();
  expect(getByText("4 members")).toBeInTheDocument();

  fireEvent.tap(getByText("Horon Labs"));
  expect(onValueChange).toHaveBeenCalledWith("labs");
});

test("the action rows stay visible and call their own handlers", async () => {
  const onCreate = rstest.fn();
  const { findByText, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <WorkspaceMenu
        workspaces={workspaces}
        value="hq"
        onCreate={onCreate}
        trigger={<view />}
        triggerChildren={<text>Horon HQ</text>}
      />
    </HoronProvider>,
  );

  const trigger = requireElement((await findByText("Horon HQ")).parentElement);
  fireEvent.layoutchange(trigger, { detail: { left: 8, top: 8, width: 200, height: 36 } });
  fireEvent.tap(trigger);

  expect(getByText("Workspace settings")).toBeInTheDocument();
  fireEvent.tap(await findByText("New workspace"));
  expect(onCreate).toHaveBeenCalledTimes(1);
  expect(queryByText("New workspace")).toBeNull();
});

test("a closed workspace menu renders no rows", async () => {
  const { container, findByText } = renderWorkspaceMenu();

  expect(await findByText("Horon HQ")).toBeInTheDocument();
  expect(container.textContent).not.toContain("New workspace");
  expect(container.textContent).not.toContain("4 members");
});
