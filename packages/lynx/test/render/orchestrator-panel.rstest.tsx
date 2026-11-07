import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { OrchestratorPanel } from "../../src/components/orchestrator-panel";
import { HoronProvider } from "../../src/provider";

/** The picker's segments, in option order. */
const pickerSegments = (container: HTMLElement): Element[] => [
  ...container.querySelectorAll("[accessibility-role-description='tab']"),
];

/** A stand-in lane: `AgentLane` is a different slug, and the panel only wraps its children. */
const Lane = ({ label }: { label: string }) => (
  <view className="flex flex-col rounded-xl border border-border-default bg-bg-surface px-3 py-2">
    <text className="text-label-md text-text-primary">{label}</text>
  </view>
);

test("the panel shows the title, the lead row, its plan, the lanes and the summary", async () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <OrchestratorPanel
        title="Prepare the investor update"
        parallelOptions={[1, 2, 3]}
        parallelValue={2}
        lead={{ initial: "C", name: "Chief of staff", running: true, status: "1 working", elapsed: "12s" }}
        plan={[{ label: "Pull Q3 metrics", running: true }, { label: "Draft the email" }]}
        summary={{ count: "1 of 2 returned", body: "The lead merges what the bots return." }}
      >
        <Lane label="Researcher" />
        <Lane label="Writer" />
      </OrchestratorPanel>
    </HoronProvider>,
  );

  expect(getByText("Prepare the investor update")).toBeInTheDocument();
  expect(getByText("Chief of staff")).toBeInTheDocument();
  expect(getByText("Lead")).toBeInTheDocument();
  expect(getByText("1 working")).toBeInTheDocument();
  expect(getByText("12s")).toBeInTheDocument();
  expect(getByText("Pull Q3 metrics")).toBeInTheDocument();
  expect(getByText("Draft the email")).toBeInTheDocument();
  expect(getByText("Researcher")).toBeInTheDocument();
  expect(getByText("Writer")).toBeInTheDocument();
  // The summary defaults its title and keeps the caller's count and body.
  expect(getByText("Summary")).toBeInTheDocument();
  expect(getByText("1 of 2 returned")).toBeInTheDocument();
  expect(getByText("The lead merges what the bots return.")).toBeInTheDocument();

  // A running lead shows the spinner; the picker marks the controlled option.
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(pickerSegments(container)[1].getAttribute("accessibility-value")).toBe("selected");
});

test("picking a parallel option reports it as a number and Stop fires only when given", async () => {
  const onParallelChange = rstest.fn();
  const onStop = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <OrchestratorPanel
        title="Standup"
        parallelOptions={[1, 2, 4]}
        parallelValue={1}
        onParallelChange={onParallelChange}
        onStop={onStop}
        lead={{ initial: "C", name: "Chief of staff" }}
      />
    </HoronProvider>,
  );

  getByText("Bots in parallel");
  fireEvent.tap(pickerSegments(container)[2]);
  expect(onParallelChange).toHaveBeenCalledWith(4);

  // The Stop control is the button-traited view after the picker; tap the text's own row.
  const stopText = getByText("Stop");
  fireEvent.tap(stopText.parentElement!);
  expect(onStop).toHaveBeenCalledTimes(1);
});

test("plan, lanes and summary are each optional, and the role caption falls back to Lead", async () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <OrchestratorPanel
        title="Bare lead view"
        parallelLabel="Fan-out"
        lead={{ initial: "H", name: "Horon", running: false }}
      />
    </HoronProvider>,
  );

  getByText("Fan-out");
  expect(getByText("Horon")).toBeInTheDocument();
  expect(getByText("Lead")).toBeInTheDocument();
  // No lanes: no connector elbow, no summary card, no spinner, and no picker without options.
  expect(pickerSegments(container)).toHaveLength(0);
  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(container.querySelector(".bg-overlay-ink-4")).toBeNull();
  expect(container.textContent).not.toContain("Summary");
  // Without onStop the Stop control is not rendered at all.
  expect(container.querySelector("[accessibility-traits='button']")).toBeNull();
});
