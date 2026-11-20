import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { ToolCallsHeader } from "../../src/components/tool-calls-header";
import { HoronProvider } from "../../src/provider";

test("the trigger folds the cards it owns and starts open by default", async () => {
  await render(
    <HoronProvider scheme="light">
      <ToolCallsHeader>
        <Text>first card</Text>
      </ToolCallsHeader>
    </HoronProvider>,
  );
  expect(screen.getByText("first card")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { expanded: true }));
  expect(screen.queryByText("first card")).toBeNull();
  expect(screen.getByRole("button", { expanded: false })).toBeTruthy();
});

test("a controlled group reports the next open state and keeps its cards hidden while closed", async () => {
  const onOpenChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolCallsHeader open={false} onOpenChange={onOpenChange}>
        <Text>held closed</Text>
      </ToolCallsHeader>
    </HoronProvider>,
  );
  expect(screen.queryByText("held closed")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { expanded: false }));
  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(screen.queryByText("held closed")).toBeNull();
});
