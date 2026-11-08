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

/** The box `<view>` wrapping the dashed hand-off path, found by the dash pattern only it uses. */
const curveBox = (container: HTMLElement): HTMLElement => {
  const glyph = [...container.querySelectorAll("svg[content]")].find((element) =>
    (element.getAttribute("content") ?? "").includes('stroke-dasharray="3 3"'),
  );
  if (!glyph?.parentElement) throw new Error("the hand-off curve was not rendered");
  return glyph.parentElement;
};

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
  expect(withCurve.container.querySelectorAll("svg").length).toBe(without.container.querySelectorAll("svg").length + 1);
});

test("a hand-off between tasks that meet exactly draws a curve of non-zero width centred on the joint", () => {
  // In `bots` "pull" ends at -16 and "draft" starts at -16, so the raw span is zero.
  const { container } = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} handoffs={[{ from: "pull", to: "draft" }]} />
    </HoronProvider>,
  );
  const box = curveBox(container);

  expect(parseFloat(box.style.width)).toBeGreaterThan(0);
  expect(parseFloat(box.style.width)).toBeCloseTo(2, 5);
  // Centred on the joint at 14/30 of the track, not hanging off its left edge.
  const centre = parseFloat(box.style.left) + parseFloat(box.style.width) / 2;
  expect(centre).toBeCloseTo((14 / 30) * 100, 4);
  // The path still runs down to the target lane instead of collapsing.
  expect(box.querySelector("svg")?.getAttribute("content")).toContain('d="M0 0 C60 0 40 100 100 100"');
  expect(parseFloat(box.style.height)).toBeGreaterThan(0);
});

test("a hand-off curve spans a positive gap and mirrors for a reverse or upward hand-off", () => {
  const gapped: LaneBot[] = [
    {
      id: "a",
      name: "A",
      initial: "A",
      tone: "sky",
      tasks: [{ id: "first", label: "First", tone: "done", start: -26, end: -20 }],
    },
    {
      id: "b",
      name: "B",
      initial: "B",
      tone: "steel",
      tasks: [{ id: "second", label: "Second", tone: "done", start: -10, end: 0 }],
    },
  ];

  const forward = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={gapped} handoffs={[{ from: "first", to: "second" }]} />
    </HoronProvider>,
  );
  const forwardBox = curveBox(forward.container);
  expect(parseFloat(forwardBox.style.width)).toBeCloseTo((10 / 30) * 100, 4);
  expect(parseFloat(forwardBox.style.left)).toBeCloseTo((10 / 30) * 100, 4);
  expect(forwardBox.querySelector("svg")?.getAttribute("content")).toContain('d="M0 0 C60 0 40 100 100 100"');

  // The same pair the other way: the target task starts before the source task ends, and sits above it.
  const reverse = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={gapped} handoffs={[{ from: "second", to: "first" }]} />
    </HoronProvider>,
  );
  const reverseBox = curveBox(reverse.container);
  expect(parseFloat(reverseBox.style.width)).toBeCloseTo((26 / 30) * 100, 4);
  expect(parseFloat(reverseBox.style.left)).toBeCloseTo((4 / 30) * 100, 4);
  // The box stays inside the track and the path leaves the source's bottom-right for the target's top-left.
  expect(parseFloat(reverseBox.style.height)).toBe(64);
  expect(parseFloat(reverseBox.style.top)).toBe(72);
  expect(reverseBox.querySelector("svg")?.getAttribute("content")).toContain('d="M100 100 C40 100 60 0 0 0"');
});

test("the approval strip reports Later and Approve, and is absent without one", async () => {
  const onLater = rstest.fn();
  const onApprove = rstest.fn();
  const { getByText } = render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} approval={{ message: "Send to 12 investors?", onLater, onApprove }} />
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
