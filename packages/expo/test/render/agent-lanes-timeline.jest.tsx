import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { AgentLanesTimeline } from "../../src/components/agent-lanes-timeline";
import { HoronProvider } from "../../src/provider";

const bots = [
  {
    id: "researcher",
    name: "Researcher",
    initial: "R",
    tone: "sky" as const,
    tasks: [{ id: "pull", label: "Pull metrics", tone: "done" as const, start: -28, end: -16 }],
  },
  {
    id: "writer",
    name: "Writer",
    initial: "W",
    tone: "steel" as const,
    tasks: [{ id: "draft", label: "Draft summary", tone: "running" as const, start: -16, end: 0 }],
  },
];

test("the range pill reports a press when it is actionable", async () => {
  const change = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline bots={bots} onRangeClick={change} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Last 30m" }));
  expect(change).toHaveBeenCalledTimes(1);
});

test("the approval strip sends Later and Approve to their own handlers", async () => {
  const later = jest.fn();
  const approve = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <AgentLanesTimeline
        bots={bots}
        approval={{ message: "Publish the summary?", onLater: later, onApprove: approve }}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Later" }));
  await fireEvent.press(screen.getByRole("button", { name: "Approve" }));
  expect(later).toHaveBeenCalledTimes(1);
  expect(approve).toHaveBeenCalledTimes(1);
});
