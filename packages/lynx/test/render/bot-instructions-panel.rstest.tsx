import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { BotInstructionsPanel } from "../../src/components/bot-instructions-panel";
import { HoronProvider } from "../../src/provider";

const instructions = [["You write the brief for", { variable: "user_name" }, "before 8 AM."]];

/** The pressable node whose own text is exactly `label`. */
const byText = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) =>
      element.getAttribute("accessibility-traits") !== null && (element.textContent ?? "").trim() === label,
  );
  if (!node) throw new Error(`no control labelled ${label}`);
  return node;
};

/** The Run button carries its own accessible name, which keeps it apart from a scenario pill. */
const runButton = (container: HTMLElement): Element => {
  const node = container.querySelector("[accessibility-label='Run']");
  if (!node) throw new Error("no Run button");
  return node;
};

test("Run reports the selected scenario, and a scenario pill moves the selection", async () => {
  const onRun = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <BotInstructionsPanel
        bot={{ initial: "R", name: "Researcher" }}
        instructions={instructions}
        variables={[{ name: "user_name", value: "Alpox" }]}
        scenarios={["Busy Monday", "Quiet day"]}
        onRun={onRun}
      />
    </HoronProvider>,
  );

  expect(getByText("before 8 AM.")).toBeInTheDocument();
  expect(getByText("Alpox")).toBeInTheDocument();

  fireEvent.tap(runButton(container));
  await Promise.resolve();
  expect(onRun).toHaveBeenLastCalledWith("Busy Monday");

  fireEvent.tap(byText(container, "Quiet day"));
  await Promise.resolve();
  fireEvent.tap(runButton(container));
  await Promise.resolve();
  expect(onRun).toHaveBeenLastCalledWith("Quiet day");
});

test("the Example tab swaps the prompt for the example and back", async () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <BotInstructionsPanel
        bot={{ initial: "R", name: "Researcher" }}
        instructions={instructions}
        example="Good morning Alpox. Two things need a yes today."
      />
    </HoronProvider>,
  );

  expect(queryByText("Good morning Alpox. Two things need a yes today.")).toBeNull();

  fireEvent.tap(byText(container, "Example"));
  await Promise.resolve();
  expect(getByText("Good morning Alpox. Two things need a yes today.")).toBeInTheDocument();
  expect(queryByText("before 8 AM.")).toBeNull();

  fireEvent.tap(byText(container, "Instructions"));
  await Promise.resolve();
  expect(getByText("before 8 AM.")).toBeInTheDocument();
});

test("a prompt without scenarios offers no Run button and shows no run output", () => {
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <BotInstructionsPanel bot={{ initial: "R", name: "Researcher" }} instructions={instructions} />
    </HoronProvider>,
  );

  expect(container.querySelector("[accessibility-label='Run']")).toBeNull();
  expect(queryByText("Run")).toBeNull();
  expect(container.querySelector("[accessibility-role-description='status']")).toBeNull();
});
