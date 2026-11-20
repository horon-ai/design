import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { BotMemoryPanel } from "../../src/components/bot-memory-panel";
import { HoronProvider } from "../../src/provider";

const memories = [
  { id: "m1", text: "Prefers Korean replies", source: "From a chat · Oct 8", group: "Preference" },
  { id: "m2", text: "Launch date is Nov 21", source: "From a chat · Oct 9", group: "Schedule" },
];

test("the meter announces the stored usage as a progress value", async () => {
  await render(
    <HoronProvider scheme="light">
      <BotMemoryPanel usage={42} memories={memories} />
    </HoronProvider>,
  );
  expect(screen.getByRole("progressbar", { name: "Memory used" }).props.accessibilityValue).toMatchObject({
    min: 0,
    max: 100,
    now: 42,
  });
});

test("a filter pill narrows the list to its group", async () => {
  await render(
    <HoronProvider scheme="light">
      <BotMemoryPanel usage={12} memories={memories} />
    </HoronProvider>,
  );
  expect(screen.getByText("Launch date is Nov 21")).toBeTruthy();
  await fireEvent.press(screen.getByRole("tab", { name: "Preference" }));
  expect(screen.getByText("Prefers Korean replies")).toBeTruthy();
  expect(screen.queryByText("Launch date is Nov 21")).toBeNull();
});

test("closing the updated pill reports the dismissal", async () => {
  const onToastDismiss = jest.fn();
  await render(
    <HoronProvider scheme="light" reducedMotion>
      <BotMemoryPanel
        usage={12}
        memories={memories}
        toast={{ title: "Memory updated", message: "Saved a preference" }}
        onToastDismiss={onToastDismiss}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Dismiss" }));
  expect(onToastDismiss).toHaveBeenCalledTimes(1);
});

test("flipping a settings switch reports the new state with the setting id", async () => {
  const onSettingChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <BotMemoryPanel
        usage={12}
        memories={memories}
        settings={[{ id: "auto", label: "Memory", description: "Let the assistant remember chats" }]}
        onSettingChange={onSettingChange}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("switch", { name: "Memory" }));
  expect(onSettingChange).toHaveBeenCalledWith("auto", true);
});
