import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Icon } from "../../src/icons";
import {
  Sidebar,
  SidebarAccount,
  SidebarAddButton,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProject,
  SidebarProjectMore,
  SidebarProjectTile,
  SidebarSpacer,
  SidebarTree,
  SidebarWorkspaceSwitch,
} from "../../src/components/sidebar";
import { HoronProvider } from "../../src/provider";

/** The one node whose accessibility label matches, inside the rendered tree. */
const byLabel = (container: Element, label: string): Element => {
  const node = container.querySelector(`[accessibility-label="${label}"]`);
  if (!node) throw new Error(`no node labelled ${label}`);
  return node;
};

/** A sidebar wired to its own collapse state, the way the gallery's demo shows it. */
function Collapsible() {
  const [open, setOpen] = useState(true);
  return (
    <view>
      {open ? (
        <Sidebar>
          <SidebarHeader initial="H" name="Horon" onCollapse={() => setOpen(false)} />
          <SidebarItem>Inbox</SidebarItem>
        </Sidebar>
      ) : (
        <view bindtap={() => setOpen(true)} accessibility-element accessibility-traits="button" accessibility-label="Expand sidebar">
          <text className="text-label-md text-text-primary">expand sidebar</text>
        </view>
      )}
    </view>
  );
}

test("the collapse button hides the column and every label with it", () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Collapsible />
    </HoronProvider>,
  );

  expect(getByText("Inbox")).toBeInTheDocument();
  expect(getByText("Horon")).toBeInTheDocument();

  fireEvent.tap(byLabel(container, "Collapse sidebar"));

  expect(queryByText("Inbox")).toBeNull();
  expect(queryByText("Horon")).toBeNull();
  expect(getByText("expand sidebar")).toBeInTheDocument();

  fireEvent.tap(byLabel(container, "Expand sidebar"));
  expect(getByText("Inbox")).toBeInTheDocument();
});

test("the collapse button reports the collapse and a row tap fires its handler", () => {
  const onCollapse = rstest.fn();
  const onInbox = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarHeader initial="H" name="Horon" onCollapse={onCollapse} />
        <SidebarItem icon={<Icon name="Bell" size={18} color="text-secondary" />} count={3} onClick={onInbox}>
          Inbox
        </SidebarItem>
      </Sidebar>
    </HoronProvider>,
  );

  fireEvent.tap(byLabel(container, "Collapse sidebar"));
  expect(onCollapse).toHaveBeenCalledTimes(1);

  fireEvent.tap(getByText("Inbox").parentElement!);
  expect(onInbox).toHaveBeenCalledTimes(1);
});

test("a tapped navigation row reports itself as the current page and keeps its count", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarItem current count={12} attention>
          Inbox
        </SidebarItem>
      </Sidebar>
    </HoronProvider>,
  );

  const row = getByText("Inbox").parentElement!;
  expect(row.getAttribute("accessibility-traits")).toBe("button");
  expect(row.getAttribute("accessibility-value")).toBe("current page");
  expect(getByText("12")).toBeInTheDocument();
  expect(byLabel(container, "Needs attention")).toBeInTheDocument();
});

test("a link row announces itself as a link instead of a button", () => {
  const onNav = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarItem href="/projects" current onClick={onNav}>
          Projects
        </SidebarItem>
      </Sidebar>
    </HoronProvider>,
  );

  const row = byLabel(container, "");
  fireEvent.tap(row);
  expect(onNav).toHaveBeenCalledTimes(1);
});

test("heading, workspace switch, tree, add button and account all render their slot content", () => {
  const { getByText, container } = render(
    <HoronProvider scheme="light">
      <Sidebar surface="photo">
        <SidebarHeader initial="H" name="Horon HQ" />
        <SidebarWorkspaceSwitch initial="H" name="Horon HQ" />
        <SidebarTree>
          <SidebarItem>API rate limits</SidebarItem>
          <SidebarItem>Release notes v0.4</SidebarItem>
        </SidebarTree>
        <SidebarAddButton>Add project</SidebarAddButton>
        <SidebarSpacer />
        <SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" />
      </Sidebar>
    </HoronProvider>,
  );

  expect(getByText("Horon HQ")).toBeInTheDocument();
  expect(getByText("API rate limits")).toBeInTheDocument();
  expect(getByText("Add project")).toBeInTheDocument();
  expect(getByText("Alpox")).toBeInTheDocument();
  // The photo surface paints its photo and veil behind the column.
  expect(container.querySelectorAll("image").length).toBe(1);
});

test("a group collapses and expands, hiding its rows while closed", () => {
  const { container, queryByText, getByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarGroup label="Projects" defaultOpen>
          <SidebarItem>Kickoff notes</SidebarItem>
        </SidebarGroup>
      </Sidebar>
    </HoronProvider>,
  );

  expect(getByText("Kickoff notes")).toBeInTheDocument();

  fireEvent.tap(getByText("Projects"));
  expect(queryByText("Kickoff notes")).toBeNull();

  fireEvent.tap(getByText("Projects"));
  expect(getByText("Kickoff notes")).toBeInTheDocument();
  expect(container).toBeTruthy();
});

test("a group that starts closed draws no rows at all", () => {
  const { queryByText, getByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarGroup label="Projects" defaultOpen={false}>
          <SidebarItem>Kickoff notes</SidebarItem>
        </SidebarGroup>
      </Sidebar>
    </HoronProvider>,
  );

  expect(getByText("Projects")).toBeInTheDocument();
  expect(queryByText("Kickoff notes")).toBeNull();
});

test("a project row toggles its panel and reports the next open state", () => {
  const onOpenChange = rstest.fn();
  const { getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarProject
          icon={
            <SidebarProjectTile className="bg-sky-500">
              <Icon name="Code" size={14} color="interactive-on-primary" />
            </SidebarProjectTile>
          }
          label="Horon app"
          onOpenChange={onOpenChange}
        >
          <SidebarItem>API rate limits</SidebarItem>
        </SidebarProject>
      </Sidebar>
    </HoronProvider>,
  );

  expect(queryByText("API rate limits")).toBeNull();

  fireEvent.tap(getByText("Horon app"));
  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(getByText("API rate limits")).toBeInTheDocument();
});

test("a project without children toggles its state but draws no tree", () => {
  const onOpenChange = rstest.fn();
  const { getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarProject icon={<SidebarProjectTile />} label="Q4 roadmap" onOpenChange={onOpenChange} />
      </Sidebar>
    </HoronProvider>,
  );

  fireEvent.tap(getByText("Q4 roadmap"));
  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(queryByText("Kickoff notes")).toBeNull();
});

test("a closed project keeps its chevron and hides the more button, and an open one swaps them", () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarProject icon={<SidebarProjectTile />} label="Horon app" actions={<SidebarProjectMore />}>
          <SidebarItem>Kickoff notes</SidebarItem>
        </SidebarProject>
      </Sidebar>
    </HoronProvider>,
  );

  // Collapsed: the actions slot is transparent, so the row still reads as closed.
  const actions = byLabel(container, "Project actions").parentElement!;
  expect(actions.className).toContain("opacity-0");

  fireEvent.tap(getByText("Horon app"));
  expect(queryByText("Kickoff notes")).toBeInTheDocument();
  expect(byLabel(container, "Project actions").parentElement!.className).not.toContain("opacity-0");
});

test("the account row announces itself as a button and keeps its email line", () => {
  const { getByText, container } = render(
    <HoronProvider scheme="light">
      <Sidebar>
        <SidebarAccount initials="AL" name="Alpox" email="alpoxdev@gmail.com" aria-label="Account" />
      </Sidebar>
    </HoronProvider>,
  );

  expect(getByText("Alpox")).toBeInTheDocument();
  expect(getByText("alpoxdev@gmail.com")).toBeInTheDocument();
  expect(byLabel(container, "Account").getAttribute("accessibility-traits")).toBe("button");
});
