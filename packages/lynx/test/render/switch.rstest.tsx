import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Switch } from "../../src/components/switch";
import { HoronProvider } from "../../src/provider";

/** The switch announces its state on the row it owns, so the tests read that one attribute. */
const control = (container: HTMLElement): Element => {
  const found = container.querySelector("[accessibility-role-description='switch']");
  if (!found) throw new Error("no switch in the tree");
  return found;
};

const state = (container: HTMLElement): string | null => control(container).getAttribute("accessibility-value");

test("a tap turns an uncontrolled switch on and a second tap turns it off", async () => {
  const { container } = render(
    <HoronProvider>
      <Switch label="Morning brief" />
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

test("a disabled switch ignores the tap and never reports a change", async () => {
  const seen: boolean[] = [];
  const { container } = render(
    <HoronProvider>
      <Switch label="Paused" disabled onCheckedChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );

  fireEvent.tap(control(container));
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(state(container)).toBe("unchecked");
});

test("a controlled switch reports the next state and stays where the caller put it", async () => {
  const seen: boolean[] = [];
  const { container } = render(
    <HoronProvider>
      <Switch checked onCheckedChange={(next) => seen.push(next)} aria-label="Weekly report" />
    </HoronProvider>,
  );

  fireEvent.tap(control(container));
  await Promise.resolve();

  expect(seen).toEqual([false]);
  expect(state(container)).toBe("checked");
});

test("the checked thumb is translated across the track and the resting one is not", () => {
  const on = render(
    <HoronProvider>
      <Switch checked />
    </HoronProvider>,
  );
  const off = render(
    <HoronProvider>
      <Switch />
    </HoronProvider>,
  );

  expect(control(on.container).querySelector(".translate-x-\\[18px\\]")).not.toBeNull();
  expect(control(off.container).querySelector(".translate-x-0")).not.toBeNull();
});

test("a passed style reaches the root that takes the className", () => {
  const labelled = render(
    <HoronProvider>
      <Switch label="Morning brief" style={{ marginTop: "7px" }} />
    </HoronProvider>,
  );
  const bare = render(
    <HoronProvider>
      <Switch aria-label="Morning brief" style={{ marginTop: "7px" }} />
    </HoronProvider>,
  );

  expect(control(labelled.container)).toHaveStyle({ marginTop: "7px" });
  expect(control(bare.container)).toHaveStyle({ marginTop: "7px" });
});
