import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { ComposerChip, TaskComposer } from "../../src/components/agent-panel";
import { HoronProvider } from "../../src/provider";

test("the composer lifts every keystroke and starts with the draft it holds", async () => {
  const change = jest.fn();
  const start = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <TaskComposer onValueChange={change} onStart={start} />
    </HoronProvider>,
  );
  await fireEvent.changeText(screen.getByLabelText("Describe a task for a bot"), "Draft the launch note");
  expect(change).toHaveBeenLastCalledWith("Draft the launch note");

  await fireEvent.press(screen.getByRole("button", { name: "Start" }));
  expect(start).toHaveBeenCalledTimes(1);
});

test("a disabled ComposerChip ignores presses and announces itself as disabled", async () => {
  const press = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ComposerChip leading="P" disabled onPress={press}>
        Paused bot
      </ComposerChip>
    </HoronProvider>,
  );
  const chip = screen.getByRole("button", { name: /Paused bot/ });
  expect(chip.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(chip);
  expect(press).not.toHaveBeenCalled();
});
