import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Slider } from "../../src/components/slider";
import { HoronProvider } from "../../src/provider";

/**
 * A Lynx slider has no element box to read, so the component measures its own row from a
 * `layoutchange` report. The tests push that report in first, exactly as the engine would, and
 * then move a finger across the reported 220px width.
 */
const control = (container: HTMLElement): Element => {
  const found = container.querySelector("[accessibility-role-description='adjustable']");
  if (!found) throw new Error("no slider in the tree");
  return found;
};

const layOut = (container: HTMLElement, left: number, width: number, height = 20) => {
  fireEvent.layoutchange(control(container), { detail: { left, width, height, top: 0 } });
};

/** The vertical control is a column: its height is the travel and its width only the hit area. */
const layOutColumn = (container: HTMLElement, top: number, height: number, left = 0, width = 30) => {
  fireEvent.layoutchange(control(container), { detail: { left, top, width, height } });
};

const value = (container: HTMLElement): string | null => control(container).getAttribute("accessibility-value");

test("a touch on the row jumps the thumb to that share and reports the snapped value", async () => {
  const seen: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider aria-label="Speed" defaultValue={0} onValueChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );
  layOut(container, 0, 220);
  expect(value(container)).toBe("0");

  // 200 of the row's 220px, the default centre alignment: the thumb's centre lands there.
  fireEvent.touchstart(control(container), { detail: { x: 200 } });
  await Promise.resolve();

  expect(seen).toEqual([91]);
  expect(value(container)).toBe("91");
});

test("a drag keeps reporting while the finger moves and commits once when it lifts", async () => {
  const changed: number[] = [];
  const committed: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider
        aria-label="Volume"
        min={0}
        max={10}
        step={1}
        onValueChange={(next) => changed.push(next)}
        onValueCommitted={(next) => committed.push(next)}
      />
    </HoronProvider>,
  );
  layOut(container, 40, 220);

  // The row starts 40px into the page, so a page x of 150 is halfway along its 220px.
  fireEvent.touchstart(control(container), { detail: { x: 40 } });
  fireEvent.touchmove(control(container), { detail: { x: 150 } });
  fireEvent.touchend(control(container));
  await Promise.resolve();

  expect(changed).toEqual([5]);
  expect(committed).toEqual([5]);
});

test("a disabled slider ignores every touch and keeps its value", async () => {
  const seen: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider aria-label="Locked" defaultValue={70} disabled onValueChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );
  layOut(container, 0, 220);

  fireEvent.touchstart(control(container), { detail: { x: 200 } });
  fireEvent.touchmove(control(container), { detail: { x: 210 } });
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(value(container)).toBe("70");
});

test("a touch before the row has been measured reports nothing instead of assuming a width", async () => {
  const seen: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider aria-label="Unmeasured" defaultValue={30} onValueChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );

  fireEvent.touchstart(control(container), { detail: { x: 120 } });
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(value(container)).toBe("30");
});

test("a vertical drag reads the finger's page y and moves the thumb up the column", async () => {
  const changed: number[] = [];
  const committed: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider
        aria-label="Pitch"
        orientation="vertical"
        min={0}
        max={10}
        step={1}
        defaultValue={0}
        onValueChange={(next) => changed.push(next)}
        onValueCommitted={(next) => committed.push(next)}
      />
    </HoronProvider>,
  );
  // The column starts at page y 100 and is 200px tall, so its bottom edge is y 300 and the range
  // grows upward: y 100 is max, y 300 is min.
  layOutColumn(container, 100, 200);

  fireEvent.touchstart(control(container), { detail: { x: 15, y: 300 } });
  fireEvent.touchmove(control(container), { detail: { x: 15, y: 200 } });
  fireEvent.touchend(control(container));
  await Promise.resolve();

  expect(changed).toEqual([5]);
  expect(committed).toEqual([5]);
  expect(value(container)).toBe("5");
});

test("a vertical slider tracks page y, so a sideways-only drag keeps its value", async () => {
  const changed: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider aria-label="Pitch" orientation="vertical" defaultValue={40} onValueChange={(next) => changed.push(next)} />
    </HoronProvider>,
  );
  layOutColumn(container, 0, 200);

  // y 120 is the row for 40 on a 200px column that grows upward, so the landing touch keeps the
  // value; the sweep that follows only changes page x, which this axis never reads.
  fireEvent.touchstart(control(container), { detail: { x: 2, y: 120 } });
  fireEvent.touchmove(control(container), { detail: { x: 28, y: 120 } });
  await Promise.resolve();

  expect(changed).toEqual([]);
  expect(value(container)).toBe("40");
});

test("a vertical touch near the top of the column lands on the high end of the range", async () => {
  const seen: number[] = [];
  const { container } = render(
    <HoronProvider>
      <Slider aria-label="Pitch" orientation="vertical" defaultValue={0} onValueChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );
  layOutColumn(container, 60, 220);

  // 6px below the column's top edge: almost the whole travel, so almost max.
  fireEvent.touchstart(control(container), { detail: { x: 15, y: 66 } });
  await Promise.resolve();

  expect(seen).toEqual([97]);
  expect(value(container)).toBe("97");
});

