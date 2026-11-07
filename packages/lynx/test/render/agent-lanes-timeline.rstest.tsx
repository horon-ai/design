import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { AgentLanesTimeline, type LaneBot } from "../../src/components/agent-lanes-timeline";
import { HoronProvider } from "../../src/provider";

const bots: LaneBot[] = [
  {
    id: "researcher",
    name: "Researcher",
    initial: "R",
    tone: "sky",
    tasks: [{ id: "pull", label: "Pull metrics", tone: "done", start: -28, end: -16 }],
  },
  {
    id: "writer",
    name: "Writer",
    initial: "W",
    tone: "steel",
    tasks: [{ id: "draft", label: "Draft summary", tone: "running", start: -16, end: 0 }],
  },
];

test("the timeline lays out one row per bot and one bar per task on the track", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} handoffs={[{ from: "pull", to: "draft" }]} />
    </HoronProvider>,
  );

  expect(getByText("Bots")).toBeInTheDocument();
  expect(getByText("Researcher")).toBeInTheDocument();
  expect(getByText("Writer")).toBeInTheDocument();
  // Two bars plus a dashed hand-off curve: the SVG carries the live-green stroke.
  expect(getByText("Pull metrics")).toBeInTheDocument();
  expect(getByText("Draft summary")).toBeInTheDocument();
  expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(1);
  // Ticks every five minutes inside a 30-minute window: 5.
  expect(container.textContent).toContain("-25m");
  expect(container.textContent).toContain("now");
});

test("the running bar spins and the done bar does not", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} />
    </HoronProvider>,
  );

  // Exactly one running bar, so exactly one spinner.
  expect(container.querySelectorAll("[accessibility-role-description='progressbar']").length).toBe(1);
});

test("a hand-off naming an unknown task is skipped instead of drawing a curve", () => {
  const withCurve = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} handoffs={[{ from: "pull", to: "draft" }]} />
    </HoronProvider>,
  );
  const without = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} handoffs={[{ from: "pull", to: "missing" }]} />
    </HoronProvider>,
  );

  // Only the real hand-off adds a curve, so the unknown one leaves one fewer SVG behind.
  expect(withCurve.container.querySelectorAll("svg").length).toBe(
    without.container.querySelectorAll("svg").length + 1,
  );
});

test("the approval strip reports Later and Approve, and is absent without one", async () => {
  const onLater = rstest.fn();
  const onApprove = rstest.fn();
  const { getByText } = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline
        bots={bots}
        approval={{ message: "Send to 12 investors?", onLater, onApprove }}
      />
    </HoronProvider>,
  );

  expect(getByText("Send to 12 investors?")).toBeInTheDocument();
  fireEvent.tap(getByText("Later").parentElement!);
  fireEvent.tap(getByText("Approve").parentElement!);
  await Promise.resolve();

  expect(onLater).toHaveBeenCalledTimes(1);
  expect(onApprove).toHaveBeenCalledTimes(1);

  const plain = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} />
    </HoronProvider>,
  );
  await Promise.resolve();
  expect(plain.container.textContent).not.toContain("Approve");
});

test("an actionable range pill forwards its tap while a plain one only shows the label", () => {
  const onRangeClick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} range="Last hour" onRangeClick={onRangeClick} />
    </HoronProvider>,
  );

  fireEvent.tap(getByText("Last hour").parentElement!);
  expect(onRangeClick).toHaveBeenCalledTimes(1);
  expect(container.querySelector("[accessibility-traits='button']")).not.toBeNull();

  const plain = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} range="Last hour" />
    </HoronProvider>,
  );
  expect(plain.container.querySelector("[accessibility-traits='button']")).toBeNull();
});
