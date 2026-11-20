import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { OrchestratorPanel } from "../../src/components/orchestrator-panel";
import { HoronProvider } from "../../src/provider";

const lead = { initial: "H", name: "Horon" };

test("the Stop button reports the stop", async () => {
  const stop = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <OrchestratorPanel title="Orchestrator" lead={lead} onStop={stop} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Stop" }));
  expect(stop).toHaveBeenCalledTimes(1);
});

test("picking a parallel option reports it as a number", async () => {
  const change = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <OrchestratorPanel
        title="Orchestrator"
        lead={lead}
        parallelOptions={[1, 2, 3]}
        parallelValue={2}
        onParallelChange={change}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByText("3"));
  expect(change).toHaveBeenCalledWith(3);
});
