import { Text } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Tooltip } from "../../src/components/tooltip";
import { HoronProvider } from "../../src/provider";

/** The trigger a tooltip wraps: a pressable label. */
function CopyTrigger() {
  return (
    <Text accessible accessibilityRole="button">
      Copy link
    </Text>
  );
}

test("pressing the trigger opens the bubble", async () => {
  await render(
    <HoronProvider scheme="light">
      <Tooltip label="Copies the URL" delay={0}>
        <CopyTrigger />
      </Tooltip>
    </HoronProvider>,
  );
  expect(screen.queryByText("Copies the URL")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Copy link" }));
  await waitFor(() => expect(screen.getByText("Copies the URL")).toBeTruthy());
});

test("the trigger carries the label as its accessibility hint for a reader who never taps", async () => {
  await render(
    <HoronProvider scheme="light">
      <Tooltip label="Sends the link to the channel" side="bottom">
        <Text accessible accessibilityRole="button">
          Share
        </Text>
      </Tooltip>
    </HoronProvider>,
  );
  const trigger = screen.getByRole("button", { name: "Share" });
  expect(trigger.props.accessibilityHint).toBe("Sends the link to the channel");
});
