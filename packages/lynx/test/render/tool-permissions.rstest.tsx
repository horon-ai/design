import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { ToolPermissions } from "../../src/components/tool-permissions";
import { HoronProvider } from "../../src/provider";

/** Every segment of every row, in display order: Allow / Ask / Off per tool. */
const segments = (container: HTMLElement): Element[] => [
  ...container.querySelectorAll("[accessibility-role-description='tab']"),
];

test("picking a segment reports the complete next map for that tool", async () => {
  const seen: Record<string, string>[] = [];
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <ToolPermissions
        title="Tool access"
        tools={[
          { name: "web_search", description: "Read public pages", defaultValue: "allow" },
          { name: "shell", description: "Run local commands" },
        ]}
        onValuesChange={(next) => seen.push(next)}
      />
    </HoronProvider>,
  );

  await findByText("web_search");
  expect(segments(container)).toHaveLength(6);
  // The unseeded row falls back to `ask`, and each row starts on its own default.
  expect(segments(container)[0].getAttribute("accessibility-value")).toBe("selected");
  expect(segments(container)[4].getAttribute("accessibility-value")).toBe("selected");

  // Row two, third segment: Off.
  fireEvent.tap(segments(container)[5]);
  await Promise.resolve();

  expect(seen).toEqual([{ web_search: "allow", shell: "off" }]);
  expect(segments(container)[5].getAttribute("accessibility-value")).toBe("selected");
  expect(segments(container)[4].getAttribute("accessibility-value")).toBe("unselected");
});

test("Allow all sets every tool to allow in one change", async () => {
  const seen: Record<string, string>[] = [];
  const { container, findByText, getByText } = render(
    <HoronProvider scheme="light">
      <ToolPermissions
        title="Tool access"
        tools={[
          { name: "get_issue", defaultValue: "ask" },
          { name: "search_documents", defaultValue: "off" },
        ]}
        onValuesChange={(next) => seen.push(next)}
      />
    </HoronProvider>,
  );

  await findByText("Allow all");
  // The label sits inside the button-traited header view; tap that view.
  const allowAll = getByText("Allow all").parentElement;
  if (!allowAll) throw new Error("no Allow all control rendered");
  fireEvent.tap(allowAll);
  await Promise.resolve();

  expect(seen).toEqual([{ get_issue: "allow", search_documents: "allow" }]);
  expect(segments(container)[0].getAttribute("accessibility-value")).toBe("selected");
  expect(segments(container)[3].getAttribute("accessibility-value")).toBe("selected");
});

test("a controlled map wins over the seed and an empty tool list stays a bare header", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <ToolPermissions
        title="Locked down"
        tools={[{ name: "shell", defaultValue: "allow" }]}
        values={{ shell: "off" }}
      />
      <ToolPermissions title="Nothing yet" tools={[]} />
    </HoronProvider>,
  );

  await findByText("shell");
  // The controlled value is Off even though the row's default was Allow.
  expect(segments(container)[2].getAttribute("accessibility-value")).toBe("selected");

  // An empty tool list renders only the header with a zero count and no segments.
  expect(segments(container)).toHaveLength(3);
  expect(container.textContent).toContain("0");
  expect(container.textContent).toContain("Nothing yet");
});
