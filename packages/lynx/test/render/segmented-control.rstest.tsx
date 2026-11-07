import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { SegmentedControl } from "../../src/components/segmented-control";
import { HoronProvider } from "../../src/provider";

const items = [
  { value: "chat", label: "Chat" },
  { value: "work", label: "Work" },
  { value: "call", label: "Call", disabled: true },
];

const segments = (container: HTMLElement): Element[] => [...container.querySelectorAll("[accessibility-role-description='tab']")];

const selected = (container: HTMLElement): string[] =>
  segments(container)
    .filter((segment) => segment.getAttribute("accessibility-value") === "selected")
    .map((segment) => segment.textContent ?? "");

/** The sliding pill is the only absolutely positioned, filled view under the row. */
const pill = (container: HTMLElement): HTMLElement | null =>
  container.querySelector<HTMLElement>("[class*='bg-overlay-ink-10']");

test("tapping a segment moves the selection and reports the chosen value", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <SegmentedControl
        aria-label="View"
        defaultValue="chat"
        onValueChange={(next) => seen.push(next)}
        items={items}
      />
    </HoronProvider>,
  );
  expect(selected(container)).toEqual(["Chat"]);

  fireEvent.tap(segments(container)[1]);
  await Promise.resolve();

  expect(seen).toEqual(["work"]);
  expect(selected(container)).toEqual(["Work"]);
});

test("a disabled segment cannot take the selection away from the current one", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <SegmentedControl aria-label="View" defaultValue="chat" onValueChange={(next) => seen.push(next)} items={items} />
    </HoronProvider>,
  );

  fireEvent.tap(segments(container)[2]);
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(selected(container)).toEqual(["Chat"]);
});

test("the pill is hidden until the active segment has been measured, then covers it", async () => {
  const { container } = render(
    <HoronProvider>
      <SegmentedControl aria-label="View" defaultValue="work" items={items} />
    </HoronProvider>,
  );
  const indicator = pill(container);
  expect(indicator).not.toBeNull();
  expect(indicator?.style.opacity).toBe("0");

  // The row's origin and the active segment's box, as the engine reports them. The row is the
  // pill's parent: both are children of the measured view, so one rect subtracts the other.
  const row = indicator?.parentElement;
  if (!row) throw new Error("the pill has no row to measure against");
  fireEvent.layoutchange(row, { detail: { left: 4, top: 4, width: 180, height: 30 } });
  fireEvent.layoutchange(segments(container)[1], { detail: { left: 84, top: 4, width: 80, height: 30 } });
  await Promise.resolve();

  expect(indicator?.style.opacity).toBe("1");
  expect(indicator?.style.left).toBe("80px");
  expect(indicator?.style.width).toBe("80px");
});

test("a controlled control stays on the caller's value while still reporting the tap", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <SegmentedControl aria-label="View" value="chat" onValueChange={(next) => seen.push(next)} items={items} />
    </HoronProvider>,
  );

  fireEvent.tap(segments(container)[1]);
  await Promise.resolve();

  expect(seen).toEqual(["work"]);
  expect(selected(container)).toEqual(["Chat"]);
});
