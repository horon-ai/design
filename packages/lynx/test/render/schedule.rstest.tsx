import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "../../src/components/schedule";
import { HoronProvider } from "../../src/provider";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
];

const times = [
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
];

/** The one node whose accessibility label matches, inside the rendered tree. */
const byLabel = (container: Element, label: string): Element => {
  const node = container.querySelector(`[accessibility-label="${label}"]`);
  if (!node) throw new Error(`no node labelled ${label}`);
  return node;
};

/** Opens a picker: the list only paints once the trigger has reported its box. */
const openPicker = (container: Element, label: string) => {
  const trigger = byLabel(container, label);
  fireEvent.layoutchange(trigger, { detail: { left: 16, top: 80, width: 160, height: 40 } });
  fireEvent.tap(trigger);
};

test("a day tap toggles the day on and off and reports the whole selection", () => {
  const onValueChange = rstest.fn();
  const { getByText } = render(
    <HoronProvider scheme="light">
      <WeekdayPicker days={days} defaultValue={["mon"]} onValueChange={onValueChange} />
    </HoronProvider>,
  );

  fireEvent.tap(getByText("T"));
  expect(onValueChange).toHaveBeenLastCalledWith(["mon", "tue"]);

  fireEvent.tap(getByText("M"));
  expect(onValueChange).toHaveBeenLastCalledWith(["tue"]);
});

test("a selected day paints inverted, an unselected one keeps the secondary ink", () => {
  const { getByText } = render(
    <HoronProvider scheme="light">
      <WeekdayPicker days={days} defaultValue={["wed"]} />
    </HoronProvider>,
  );

  expect(getByText("W").parentElement!.className).toContain("bg-interactive-primary");
  expect(getByText("M").parentElement!.className).toContain("bg-overlay-ink-6");
});

test("the picker list paints its options in a scroll-view and a pick reports the value", () => {
  const onValueChange = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <PickerField aria-label="Time" items={times} defaultValue="08:00" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  // Closed: no list yet, only the chosen label on the trigger.
  expect(container.querySelector("scroll-view")).toBeNull();

  openPicker(container, "Time");
  const list = container.querySelector("scroll-view");
  expect(list).not.toBeNull();
  expect(list!.textContent).toContain("7:00 AM");

  fireEvent.tap(getByText("9:00 AM"));
  expect(onValueChange).toHaveBeenCalledWith("09:00");
  expect(container.querySelector("scroll-view")).toBeNull();
});

test("the card skips the next-run strip when it has none, and shows it when it does", () => {
  const { queryByText, rerender } = render(
    <HoronProvider scheme="light">
      <ScheduleCard title="Morning brief">
        <ScheduleSection label="Days">
          <WeekdayPicker days={days} />
        </ScheduleSection>
      </ScheduleCard>
    </HoronProvider>,
  );

  expect(queryByText("Next run: Tomorrow")).toBeNull();

  rerender(
    <HoronProvider scheme="light">
      <ScheduleCard title="Morning brief" nextRun="Next run: Tomorrow">
        <ScheduleSection label="Days">
          <WeekdayPicker days={days} />
        </ScheduleSection>
      </ScheduleCard>
    </HoronProvider>,
  );
  expect(queryByText("Next run: Tomorrow")).not.toBeNull();
});

test("a day list with no days paints no circle and keeps only the group", () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <WeekdayPicker days={[]} aria-label="Repeat on" onValueChange={onValueChange} />
    </HoronProvider>,
  );

  expect(container.querySelectorAll('[accessibility-label="Monday"]').length).toBe(0);
  expect(container.querySelectorAll('[accessibility-value="selected"]').length).toBe(0);
  expect(byLabel(container, "Repeat on")).not.toBeNull();
  expect(onValueChange).not.toHaveBeenCalled();
});

test("a picker with no items opens an empty list instead of a row", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <PickerField aria-label="Empty time" items={[]} defaultValue="08:00" />
    </HoronProvider>,
  );

  openPicker(container, "Empty time");
  const list = container.querySelector("scroll-view");
  expect(list).not.toBeNull();
  expect(list!.textContent?.trim()).toBe("");
  expect(container.querySelectorAll('[accessibility-value="selected"]').length).toBe(0);
});

test("a card with no next run and no sections draws only its title", () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <ScheduleCard title="Morning brief">{null}</ScheduleCard>
    </HoronProvider>,
  );

  expect(getByText("Morning brief")).not.toBeNull();
  expect(queryByText("Next run")).toBeNull();
  expect(container.querySelectorAll("scroll-view").length).toBe(0);
});
