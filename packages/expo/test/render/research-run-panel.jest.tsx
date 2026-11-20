import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { ResearchRunPanel } from "../../src/components/research-run-panel";
import { HoronProvider } from "../../src/provider";

test("a finished run hands the follow-up over and clears the field", async () => {
  const onFollowUp = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ResearchRunPanel question="What changed in the EU AI Act?" running={false} onFollowUp={onFollowUp} />
    </HoronProvider>,
  );
  const field = screen.getByLabelText("Ask a follow-up");
  await fireEvent.changeText(field, "And the enforcement timeline?");
  await fireEvent.press(screen.getByRole("button", { name: "Send" }));
  expect(onFollowUp).toHaveBeenCalledWith("And the enforcement timeline?");
  expect(screen.getByLabelText("Ask a follow-up").props.value).toBe("");
});

test("while a run is live the round button stops it instead of submitting", async () => {
  const onStop = jest.fn();
  const onFollowUp = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ResearchRunPanel question="What changed?" running onStop={onStop} onFollowUp={onFollowUp} />
    </HoronProvider>,
  );
  expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Stop" }));
  expect(onStop).toHaveBeenCalledTimes(1);
  expect(onFollowUp).not.toHaveBeenCalled();
});

test("the running status line is a button when the caller makes it expandable", async () => {
  const onToggleStatus = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ResearchRunPanel
        question="What changed?"
        running
        elapsed="12s"
        read={2}
        total={4}
        onToggleStatus={onToggleStatus}
      />
    </HoronProvider>,
  );
  expect(screen.getByText(/2 of 4 read/)).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: /Researching/ }));
  expect(onToggleStatus).toHaveBeenCalledTimes(1);
});
