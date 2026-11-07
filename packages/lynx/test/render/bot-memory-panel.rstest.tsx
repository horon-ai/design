import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { BotMemoryPanel } from "../../src/components/bot-memory-panel";
import { HoronProvider } from "../../src/provider";

const memories = [
  { id: "1", group: "About you", text: "Runs Horon HQ", source: "From a chat · Oct 8" },
  { id: "2", group: "Preferences", text: "Wants replies under 120 words", source: "From a chat · just now", fresh: true },
  { id: "3", group: "People", text: "Lena handles invoices", source: "From a chat · Oct 14" },
];

/** The pressable node whose own text is exactly `label`, so a tab and its tray are told apart. */
const byText = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) =>
      element.getAttribute("accessibility-traits") !== null && (element.textContent ?? "").trim() === label,
  );
  if (!node) throw new Error(`no control labelled ${label}`);
  return node;
};

/** The pressable node carrying an accessible name, as the toast's close button does. */
const byLabel = (container: HTMLElement, label: string): Element => {
  const node = container.querySelector(`[accessibility-label='${label}']`);
  if (!node) throw new Error(`no control named ${label}`);
  return node;
};

test("Add memory reports the add and the filter tabs narrow the list", async () => {
  const onAdd = rstest.fn();
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <BotMemoryPanel usage={62} memories={memories} onAdd={onAdd} />
    </HoronProvider>,
  );

  expect(getByText("62% full")).toBeInTheDocument();
  expect(getByText("Runs Horon HQ")).toBeInTheDocument();

  fireEvent.tap(byText(container, "People"));
  await Promise.resolve();

  expect(getByText("Lena handles invoices")).toBeInTheDocument();
  expect(queryByText("Runs Horon HQ")).toBeNull();

  fireEvent.tap(byText(container, "Add memory"));
  await Promise.resolve();
  expect(onAdd).toHaveBeenCalledTimes(1);

  fireEvent.tap(byText(container, "All"));
  await Promise.resolve();
  expect(getByText("Runs Horon HQ")).toBeInTheDocument();
});

test("a settings switch reports its id and the next state", async () => {
  const onSettingChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <BotMemoryPanel
        usage={10}
        memories={[]}
        settings={[{ id: "saved", label: "Use saved memories", defaultChecked: true }]}
        onSettingChange={onSettingChange}
      />
    </HoronProvider>,
  );

  const control = container.querySelector("[accessibility-role-description='switch']");
  if (!control) throw new Error("no settings switch");
  fireEvent.tap(control);
  await Promise.resolve();

  expect(onSettingChange).toHaveBeenCalledWith("saved", false);
});

test("dismissing the toast plays its exit and then reports the dismissal", async () => {
  const onToastDismiss = rstest.fn();
  const toast = { title: "Memory updated", message: "Noted" };
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <BotMemoryPanel usage={10} memories={[]} toast={toast} onToastDismiss={onToastDismiss} />
    </HoronProvider>,
  );

  expect(getByText("Memory updated")).toBeInTheDocument();

  fireEvent.tap(byLabel(container, "Dismiss"));
  await Promise.resolve();
  expect(onToastDismiss).not.toHaveBeenCalled();

  const pill = container.querySelector("[accessibility-role-description='status']");
  if (!pill) throw new Error("no status pill");
  fireEvent.animationend(pill);
  await Promise.resolve();

  expect(onToastDismiss).toHaveBeenCalledTimes(1);
  expect(queryByText("Memory updated")).toBeNull();
});

test("without a toast no status pill is drawn, so the dismiss control does not exist", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <BotMemoryPanel usage={10} memories={memories} />
    </HoronProvider>,
  );

  expect(container.querySelector("[accessibility-role-description='status']")).toBeNull();
  expect(container.querySelector("[accessibility-label='Dismiss']")).toBeNull();
});
