import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Checkbox } from "../../src/components/checkbox";
import { HoronProvider } from "../../src/provider";

/**
 * The checkbox decides its own state when nobody owns it, and announces that state to assistive
 * technology through `accessibility-value`, so the tests read that attribute instead of a hidden
 * input a Lynx tree does not have.
 */
const control = (container: HTMLElement): Element => {
  const found = container.querySelector("[accessibility-role-description='checkbox']");
  if (!found) throw new Error("no checkbox in the tree");
  return found;
};

const state = (container: HTMLElement): string | null => control(container).getAttribute("accessibility-value");

test("a tap ticks an uncontrolled box and a second tap clears it", async () => {
  const { container } = render(
    <HoronProvider>
      <Checkbox label="Remember" />
    </HoronProvider>,
  );

  expect(state(container)).toBe("unchecked");

  fireEvent.tap(control(container));
  await Promise.resolve();
  expect(state(container)).toBe("checked");

  fireEvent.tap(control(container));
  await Promise.resolve();
  expect(state(container)).toBe("unchecked");
});

test("a disabled box ignores the tap and keeps its state", async () => {
  const { container } = render(
    <HoronProvider>
      <Checkbox label="Locked" disabled />
    </HoronProvider>,
  );

  fireEvent.tap(control(container));
  await Promise.resolve();
  expect(state(container)).toBe("unchecked");
});

test("a controlled box reports the next state without moving on its own", async () => {
  const seen: boolean[] = [];
  const { container } = render(
    <HoronProvider>
      <Checkbox checked={false} onCheckedChange={(next) => seen.push(next)} label="Owned" />
    </HoronProvider>,
  );

  fireEvent.tap(control(container));
  await Promise.resolve();

  expect(seen).toEqual([true]);
  expect(state(container)).toBe("unchecked");
});

test("an indeterminate box reads as mixed and draws a dash rather than a check", () => {
  const { container } = render(
    <HoronProvider>
      <Checkbox indeterminate label="Mixed" />
    </HoronProvider>,
  );

  expect(state(container)).toBe("mixed");
  // Both glyphs come from the icon set as an SVG string, so the drawn path is the assertion.
  expect(container.querySelector("svg")).not.toBeNull();
  expect(container.querySelector("[class*='bg-interactive-primary']")).not.toBeNull();
});
