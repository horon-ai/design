import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { ToolCall } from "../../src/components/tool-call";
import { ToolCallsHeader } from "../../src/components/tool-calls-header";
import { HoronProvider } from "../../src/provider";

const tool = { icon: null, name: "Web search" };

/** The group trigger is the first pressable element; the `ToolCall` headers come after it. */
const trigger = (container: HTMLElement): Element =>
  container.querySelectorAll("[accessibility-traits='button']")[0];

function Group({ defaultOpen, open, onOpenChange }: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
}) {
  return (
    <HoronProvider>
      <ToolCallsHeader
        elapsed="4.0s"
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <ToolCall status="done" tool={tool} summary="First call" />
        <ToolCall status="running" tool={tool} summary="Second call" />
      </ToolCallsHeader>
    </HoronProvider>
  );
}

test("the group starts open and folds every call away when its header is tapped", async () => {
  const { container, findByText, queryByText } = render(<Group />);

  expect(await findByText("Using tools…")).toBeTruthy();
  expect(queryByText("First call")).toBeTruthy();
  expect(queryByText("Second call")).toBeTruthy();
  expect(trigger(container).getAttribute("accessibility-value")).toBe("expanded");

  fireEvent.tap(trigger(container));
  await Promise.resolve();

  expect(queryByText("First call")).toBeNull();
  expect(queryByText("Second call")).toBeNull();
  expect(trigger(container).getAttribute("accessibility-value")).toBe("collapsed");

  fireEvent.tap(trigger(container));
  await Promise.resolve();

  expect(queryByText("First call")).toBeTruthy();
  expect(queryByText("Second call")).toBeTruthy();
});

test("defaultOpen false keeps the group folded until the header is tapped", async () => {
  const { container, findByText, queryByText } = render(<Group defaultOpen={false} />);

  await findByText("Using tools…");
  expect(queryByText("First call")).toBeNull();

  fireEvent.tap(trigger(container));
  await Promise.resolve();

  expect(queryByText("First call")).toBeTruthy();
});

test("a controlled group reports the next state and stays on the caller's value", async () => {
  const seen: boolean[] = [];
  const { container, findByText, queryByText } = render(
    <Group open={false} onOpenChange={(next) => seen.push(next)} />,
  );

  await findByText("Using tools…");
  fireEvent.tap(trigger(container));
  await Promise.resolve();

  expect(seen).toEqual([true]);
  expect(queryByText("First call")).toBeNull();
  expect(trigger(container).getAttribute("accessibility-value")).toBe("collapsed");
});

test("only the first three icons are drawn as chips", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <ToolCallsHeader
        icons={[
          <text key="a" className="text-caption">A</text>,
          <text key="b" className="text-caption">B</text>,
          <text key="c" className="text-caption">C</text>,
          <text key="d" className="text-caption">D</text>,
        ]}
      >
        <ToolCall status="done" tool={tool} summary="First call" />
      </ToolCallsHeader>
    </HoronProvider>,
  );

  await findByText("Using tools…");
  // Each chip is a 28px rounded view; the caret and the status icons are not.
  expect(container.textContent).toContain("A");
  expect(container.textContent).toContain("C");
  expect(container.textContent).not.toContain("D");
});
