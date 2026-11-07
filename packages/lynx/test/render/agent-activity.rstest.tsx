import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { StreamingText, ThinkingIndicator, ToolStep, WorkLog } from "../../src/components/agent-activity";
import { HoronProvider } from "../../src/provider";

const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected an element to be rendered");
  return element;
};

const byLabel = (container: HTMLElement, label: string): Element => {
  const found = container.querySelector(`[accessibility-label='${label}']`);
  if (!found) throw new Error(`no control labelled ${label}`);
  return found;
};

test("the thinking pill keeps its label and the three staggered dots", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <ThinkingIndicator label="Searching the workspace…" />
    </HoronProvider>,
  );

  const pill = requireElement(container.querySelector("[accessibility-role-description='status']"));
  expect(pill.getAttribute("accessibility-label")).toBe("Searching the workspace…");
  // Three 7px dots, the second and third delayed 150ms apart.
  const dots = [...container.querySelectorAll(".size-\\[7px\\]")].map((dot) => requireElement(dot));
  expect(dots.length).toBe(3);
  expect(dots[1].getAttribute("style")).toContain("150ms");
  expect(dots[2].getAttribute("style")).toContain("300ms");
});

test("a finished stream drops the caret and announces the answer", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <StreamingText text="Drafted replies for 2 of 6 emails." streaming={false} />
    </HoronProvider>,
  );

  expect(container.textContent).toContain("Drafted replies for 2 of 6 emails.");
  // The caret is only mounted while the stream is open.
  expect(container.querySelector(".bg-interactive-primary")).toBeNull();
  const bubble = container.querySelector("[accessibility-role-description='status']");
  expect(bubble!.getAttribute("accessibility-label")).toBe("Drafted replies for 2 of 6 emails.");
});

test("a live stream shows the caret and hides the answer from the accessible name", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <StreamingText text="Working" smooth={false} />
    </HoronProvider>,
  );

  expect(container.querySelector(".bg-interactive-primary")).not.toBeNull();
  const bubble = container.querySelector("[accessibility-role-description='text']");
  expect(bubble!.getAttribute("accessibility-label")).toBeNull();
});

test("a tool step reports its tap and a failed one paints the error text", async () => {
  const onClick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <ToolStep
        state="failed"
        title="Couldn't open the calendar"
        detail="Calendar needs to be reconnected"
        onClick={onClick}
      />
    </HoronProvider>,
  );

  const title = getByText("Couldn't open the calendar");
  expect(title.className).toContain("text-text-danger");
  expect(getByText("Calendar needs to be reconnected")).toBeInTheDocument();

  fireEvent.tap(container.querySelector("[accessibility-traits='button']")!);
  await Promise.resolve();
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("a disabled tool step swallows the tap", async () => {
  const onClick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <ToolStep state="running" title="Searching Gmail" onClick={onClick} disabled />
    </HoronProvider>,
  );

  await Promise.resolve();
  const row = getByText("Searching Gmail").parentElement!.parentElement!;
  fireEvent.tap(row);
  await Promise.resolve();
  expect(onClick).not.toHaveBeenCalled();
  expect(container.querySelector("[accessibility-traits='disabled']")).not.toBeNull();
});

test("the work log collapses its steps on a tap of the summary", async () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <WorkLog
        summary="Worked for 42s · 3 steps"
        steps={[
          { id: "read", title: "Read 41 new emails", detail: "Inbox · since 6 PM" },
          { id: "draft", title: "Drafting replies", running: true },
        ]}
      />
    </HoronProvider>,
  );

  expect(getByText("Read 41 new emails")).toBeInTheDocument();

  fireEvent.tap(byLabel(container, "Worked for 42s · 3 steps"));
  await Promise.resolve();

  expect(queryByText("Read 41 new emails")).toBeNull();
  expect(container.querySelector("[accessibility-value='collapsed']")).not.toBeNull();
});
