import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { AgentSteeringPanel } from "../../src/components/agent-steering-panel";
import { HoronProvider } from "../../src/provider";

const steps = [
  { id: "read", label: "Read the sheet", status: "done" as const, time: "1.4s" },
  { id: "summarise", label: "Summarise the rows", status: "active" as const },
];

test("the steer box queues the trimmed text and empties itself", async () => {
  const steer = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Review" steps={steps} onSteer={steer} />
    </HoronProvider>,
  );
  const field = screen.getByLabelText("Steer the bot…");
  await fireEvent.changeText(field, "  Keep the revenue table  ");
  await fireEvent.press(screen.getByRole("button", { name: "Send" }));
  expect(steer).toHaveBeenCalledWith("Keep the revenue table", false);
  expect(screen.getByLabelText("Steer the bot…").props.value).toBe("");
});

test("an empty steer box sends nothing", async () => {
  const steer = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Review" steps={steps} onSteer={steer} />
    </HoronProvider>,
  );
  await fireEvent.changeText(screen.getByLabelText("Steer the bot…"), "   ");
  await fireEvent.press(screen.getByRole("button", { name: "Send" }));
  expect(steer).not.toHaveBeenCalled();
});

test("the pause button hands the next paused value to the caller", async () => {
  const pause = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel title="Review" steps={steps} onPausedChange={pause} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Pause" }));
  expect(pause).toHaveBeenCalledWith(true);
});

test("a queued note applies now with its id", async () => {
  const apply = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <AgentSteeringPanel
        title="Review"
        steps={steps}
        notes={[{ id: "one", text: "Drop the chart." }]}
        onApplyNow={apply}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Now" }));
  expect(apply).toHaveBeenCalledWith("one");
});

test("removing a note reports its id so the caller can drop it", async () => {
  const remove = jest.fn();
  await render(
    <HoronProvider scheme="light" reducedMotion>
      <AgentSteeringPanel
        title="Review"
        steps={steps}
        notes={[{ id: "one", text: "Drop the chart." }]}
        onRemoveNote={remove}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Remove note" }));
  expect(remove).toHaveBeenCalledWith("one");
});
