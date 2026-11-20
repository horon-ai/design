import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { JumpToLatest, VoiceInput } from "../../src/components/chat-controls";
import { HoronProvider } from "../../src/provider";

test("Jump to latest scrolls through the handler the caller passes", async () => {
  const onPress = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <JumpToLatest onPress={onPress} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Jump to latest" }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("the voice pill's stop button ends the recording", async () => {
  const onStop = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <VoiceInput elapsed="0:07" recording={false} onStop={onStop} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Stop recording" }));
  expect(onStop).toHaveBeenCalledTimes(1);
});
