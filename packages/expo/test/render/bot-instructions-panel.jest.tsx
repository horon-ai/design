import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { BotInstructionsPanel, PanelPillTabs } from "../../src/components/bot-instructions-panel";
import { HoronProvider } from "../../src/provider";

test("the Example tab swaps the prompt for the example text", async () => {
  await render(
    <HoronProvider scheme="light">
      <BotInstructionsPanel
        bot={{ initial: "R", name: "Researcher" }}
        instructions={[["Summarise the weekly numbers."]]}
        example={<Text>Summarised 4 sheets last Tuesday.</Text>}
      />
    </HoronProvider>,
  );
  expect(screen.getByText("Summarise the weekly numbers.")).toBeTruthy();
  await fireEvent.press(screen.getByRole("tab", { name: "Example" }));
  expect(screen.getByText("Summarised 4 sheets last Tuesday.")).toBeTruthy();
  expect(screen.queryByText("Summarise the weekly numbers.")).toBeNull();
});

test("Run reports the scenario the pills select", async () => {
  const onRun = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <BotInstructionsPanel
        bot={{ initial: "R", name: "Researcher" }}
        instructions={[["Summarise the sheet."]]}
        scenarios={["Weekly digest", "Board update"]}
        onRun={onRun}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("tab", { name: "Board update" }));
  await fireEvent.press(screen.getByRole("button", { name: "Run" }));
  expect(onRun).toHaveBeenCalledWith("Board update");
});

test("a controlled PanelPillTabs reports every next value and keeps the caller's selection", async () => {
  const onValueChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <PanelPillTabs
        aria-label="View"
        value="first"
        onValueChange={onValueChange}
        items={[
          { value: "first", label: "First" },
          { value: "second", label: "Second" },
        ]}
      />
    </HoronProvider>,
  );
  expect(screen.getByRole("tab", { name: "First" }).props.accessibilityState).toMatchObject({ selected: true });
  await fireEvent.press(screen.getByRole("tab", { name: "Second" }));
  expect(onValueChange).toHaveBeenCalledWith("second");
  expect(screen.getByRole("tab", { name: "First" }).props.accessibilityState).toMatchObject({ selected: true });
});
