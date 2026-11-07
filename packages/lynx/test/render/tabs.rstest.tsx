import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Tabs, TabsList, TabsPanel, TabsTab } from "../../src/components/tabs";
import { HoronProvider } from "../../src/provider";

/** The one tab whose label matches, inside the rendered tree. */
const tabByName = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find((element) => element.getAttribute("accessibility-label") === label);
  if (!node) throw new Error(`no tab named ${label}`);
  return node;
};

test("tapping a tab switches the visible panel and reports the new value", () => {
  const onValueChange = rstest.fn();
  const { container, queryByText, getByText } = render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="activity" onValueChange={onValueChange}>
        <TabsList>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
        </TabsList>
        <TabsPanel value="activity">Recent runs</TabsPanel>
        <TabsPanel value="routines">Scheduled work</TabsPanel>
      </Tabs>
    </HoronProvider>,
  );

  expect(getByText("Recent runs")).toBeInTheDocument();
  expect(queryByText("Scheduled work")).toBeNull();

  fireEvent.tap(tabByName(container, "Routines"));

  expect(onValueChange).toHaveBeenCalledWith("routines");
  expect(getByText("Scheduled work")).toBeInTheDocument();
  expect(queryByText("Recent runs")).toBeNull();
});

test("a disabled tab never selects", () => {
  const onValueChange = rstest.fn();
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="activity" onValueChange={onValueChange}>
        <TabsList>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="plugins" disabled>
            Plugins
          </TabsTab>
        </TabsList>
        <TabsPanel value="activity">Recent runs</TabsPanel>
        <TabsPanel value="plugins">Plugin list</TabsPanel>
      </Tabs>
    </HoronProvider>,
  );

  fireEvent.tap(tabByName(container, "Plugins"));

  expect(onValueChange).not.toHaveBeenCalled();
  expect(queryByText("Plugin list")).toBeNull();
});

test("the count pill and the active label are painted from the selected value", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="mcp">
        <TabsList>
          <TabsTab value="skills" count={6}>
            Skills
          </TabsTab>
          <TabsTab value="mcp" count={4}>
            MCP
          </TabsTab>
        </TabsList>
      </Tabs>
    </HoronProvider>,
  );

  const active = tabByName(container, "MCP");
  const idle = tabByName(container, "Skills");
  expect(active.textContent).toContain("4");
  expect(active.className).toContain("text-text-primary");
  expect(idle.className).toContain("text-text-secondary");
});
