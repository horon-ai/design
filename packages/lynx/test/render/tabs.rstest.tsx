import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Tabs, TabsList, TabsPanel, TabsTab } from "../../src/components/tabs";
import { HoronProvider } from "../../src/provider";

/** The one tab whose label matches, inside the rendered tree. */
const tabByName = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) => element.getAttribute("accessibility-label") === label,
  );
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

/** The sliding pill on a solid list is the only 10% ink view above the row. */
const pill = (container: HTMLElement): HTMLElement | null =>
  container.querySelector<HTMLElement>("[class*='bg-overlay-ink-10']");

test("the pill follows the tapped tab from the boxes remembered before the switch", async () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="routines">Routines</TabsTab>
        </TabsList>
      </Tabs>
    </HoronProvider>,
  );

  // No tab has reported a box yet, so nothing is drawn.
  expect(pill(container)).toBeNull();

  const wrappers = [...container.querySelectorAll(".shrink-0")];
  const track = wrappers[0].parentElement;
  if (!track) throw new Error("the tab has no measured track");
  fireEvent.layoutchange(track, { detail: { height: 40, left: 8, top: 8, width: 300 } });
  fireEvent.layoutchange(wrappers[0], { detail: { height: 40, left: 8, top: 8, width: 90 } });
  fireEvent.layoutchange(wrappers[1], { detail: { height: 40, left: 98, top: 8, width: 120 } });
  await Promise.resolve();

  expect(pill(container)?.style.left).toBe("0px");
  expect(pill(container)?.style.width).toBe("90px");

  // Neither tab lays out again; only the selected value changes, so the pill reads the second
  // tab's earlier reading: 98-8 left, 120 wide.
  fireEvent.tap(tabByName(container, "Routines"));
  await Promise.resolve();
  expect(pill(container)?.style.left).toBe("90px");
  expect(pill(container)?.style.width).toBe("120px");
});

test("a vertical set lays the tab list out as a column", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="alpha" orientation="vertical">
        <TabsList>
          <TabsTab value="alpha">Alpha</TabsTab>
          <TabsTab value="beta">Beta</TabsTab>
        </TabsList>
      </Tabs>
    </HoronProvider>,
  );

  const wrapper = container.querySelector(".shrink-0");
  const track = wrapper?.parentElement;
  if (!track) throw new Error("the tabs have no track");
  expect(track.getAttribute("class")).toContain("flex-col");
  expect(track.getAttribute("class")).not.toContain("flex-row");
});

test("a caller style lands on every tab part's own root", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Tabs defaultValue="alpha" style={{ width: "300px" }}>
        <TabsList style={{ width: "301px" }}>
          <TabsTab value="alpha" style={{ width: "302px" }}>
            Alpha
          </TabsTab>
        </TabsList>
        <TabsPanel value="alpha" style={{ width: "303px" }}>
          Alpha panel
        </TabsPanel>
      </Tabs>
    </HoronProvider>,
  );

  for (const width of [300, 301, 302, 303]) {
    expect(container.querySelector(`[style*="width: ${width}px"]`)).not.toBeNull();
  }
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
