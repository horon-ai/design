import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { PlanStep } from "../../src/components/plan-step";
import { HoronProvider } from "../../src/provider";

test("retrying a failed step reports the retry", async () => {
  const retry = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <PlanStep
        status="failed"
        index={2}
        title="Write the parser"
        error="Unexpected token at line 84."
        onRetry={retry}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Retry from here" }));
  expect(retry).toHaveBeenCalledTimes(1);
});

test("a step that has not failed offers no retry", async () => {
  const retry = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <PlanStep
        status="running"
        index={2}
        title="Write the parser"
        error="Unexpected token at line 84."
        onRetry={retry}
      />
    </HoronProvider>,
  );
  expect(screen.queryByRole("button", { name: "Retry from here" })).toBeNull();
});

test("each step announces its number and its state", async () => {
  await render(
    <HoronProvider scheme="light">
      <PlanStep status="pending" index={3} title="Publish" last />
    </HoronProvider>,
  );
  const marker = screen.getByLabelText("Step 3");
  expect(marker.props.accessibilityValue).toMatchObject({ text: "Not started" });
});
