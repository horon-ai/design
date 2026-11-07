import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { AgentSteeringPanel, type SteeringNote, type SteeringStep } from "../../src/components/agent-steering-panel";
import { HoronProvider } from "../../src/provider";

const steps: SteeringStep[] = [
  { id: "read", label: "Read 41 new emails", status: "done", time: "1.4s" },
  { id: "sort", label: "Sort the 6 that need you", status: "active", time: "4.5s" },
  { id: "draft", label: "Draft replies", status: "todo" },
];

const notes: SteeringNote[] = [{ id: "n1", text: "Keep replies under 120 words" }];

const byLabel = (container: HTMLElement, label: string): Element => {
  const found = container.querySelector(`[accessibility-label='${label}']`);
  if (!found) throw new Error(`no control labelled ${label}`);
  return found;
};

test("the step rail draws each marker: a check, a spinner and a waiting ring", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Triage overnight email" steps={steps} />
    </HoronProvider>,
  );

  expect(getByText("Read 41 new emails")).toBeInTheDocument();
  expect(getByText("1.4s")).toBeInTheDocument();
  expect(container.querySelector("[accessibility-label='Done']")).not.toBeNull();
  expect(container.querySelector("[accessibility-label='Waiting']")).not.toBeNull();
  expect(getByText("Draft replies").className).toContain("text-text-secondary");
});

test("the pause button reports the next paused value and swaps its glyph", () => {
  const onPausedChange = rstest.fn();
  const running = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Triage" steps={steps} onPausedChange={onPausedChange} />
    </HoronProvider>,
  );

  fireEvent.tap(byLabel(running.container, "Pause"));
  expect(onPausedChange).toHaveBeenCalledWith(true);

  const paused = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Triage" steps={steps} paused onPausedChange={onPausedChange} />
    </HoronProvider>,
  );
  expect(paused.container.querySelector("[accessibility-label='Resume']")).not.toBeNull();
  expect(paused.container.querySelector("[accessibility-value='true']")).not.toBeNull();
});

test("a queued note applies now and leaves once its exit animation ends", async () => {
  const onApplyNow = rstest.fn();
  const onRemoveNote = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel
        title="Triage"
        steps={steps}
        notes={notes}
        onApplyNow={onApplyNow}
        onRemoveNote={onRemoveNote}
      />
    </HoronProvider>,
  );

  expect(getByText("Keep replies under 120 words")).toBeInTheDocument();
  // The queue caption counts the notes still waiting: 1.
  expect(getByText("Queued for the next step")).toBeInTheDocument();

  fireEvent.tap(getByText("Now").parentElement!);
  await Promise.resolve();
  expect(onApplyNow).toHaveBeenCalledWith("n1");

  // Remove starts the pop-out; the panel reports the id only when the animation ends.
  fireEvent.tap(byLabel(container, "Remove note"));
  await Promise.resolve();
  expect(onRemoveNote).not.toHaveBeenCalled();

  const row = getByText("Keep replies under 120 words").parentElement!;
  fireEvent.animationend(row);
  await Promise.resolve();
  expect(onRemoveNote).toHaveBeenCalledWith("n1");
});

test("an applied note shows the filled Now pill, not the actions", () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel
        title="Triage"
        steps={steps}
        notes={[{ id: "n2", text: "Hold the deck", applied: true }]}
      />
    </HoronProvider>,
  );

  // React kept the queue caption whenever any note existed; only the count follows the waiting ones.
  expect(getByText("Queued for the next step")).toBeInTheDocument();
  expect(getByText("0")).toBeInTheDocument();
  expect(container.querySelector("[accessibility-label='Remove note']")).toBeNull();
  expect(queryByText("Hold the deck")).toBeInTheDocument();
});

test("the steer box queues on the send button and interrupts on confirm", async () => {
  const onSteer = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Triage" steps={steps} onSteer={onSteer} />
    </HoronProvider>,
  );

  const field = container.querySelector("input")!;
  const input = field.eventMap?.["bindEvent:input"];
  if (!input) throw new Error("no bindinput handler on the steer box");
  input({ type: "bindEvent:input", detail: { value: "Keep it short" } });
  await Promise.resolve();

  fireEvent.tap(byLabel(container, "Send"));
  await Promise.resolve();
  expect(onSteer).toHaveBeenCalledWith("Keep it short", false);

  const confirm = field.eventMap?.["bindEvent:confirm"];
  if (!confirm) throw new Error("no bindconfirm handler on the steer box");
  // The draft cleared after sending, so an empty confirm never steers.
  confirm({ type: "bindEvent:confirm", detail: { value: "" } });
  await Promise.resolve();
  expect(onSteer).toHaveBeenCalledTimes(1);
});

test("an empty draft never steers", async () => {
  const onSteer = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Triage" steps={steps} onSteer={onSteer} />
    </HoronProvider>,
  );

  fireEvent.tap(byLabel(container, "Send"));
  await Promise.resolve();
  expect(onSteer).not.toHaveBeenCalled();
});
