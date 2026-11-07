import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Radio, RadioGroup } from "../../src/components/radio-group";
import { HoronProvider } from "../../src/provider";

/** Every radio announces its own state, so a selection can be read straight off the rows. */
const radios = (container: HTMLElement): Element[] => [...container.querySelectorAll("[accessibility-role-description='radio']")];

const selected = (container: HTMLElement): string[] =>
  radios(container)
    .filter((radio) => radio.getAttribute("accessibility-value") === "selected")
    .map((radio) => radio.textContent ?? "");

test("picking a radio clears the previous pick, so only one stays selected", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <RadioGroup aria-label="Repeat" defaultValue="day" onValueChange={(next) => seen.push(next)}>
        <Radio value="day" label="Every day" />
        <Radio value="week" label="Every week" />
      </RadioGroup>
    </HoronProvider>,
  );
  expect(selected(container)).toEqual(["Every day"]);

  fireEvent.tap(radios(container)[1]);
  await Promise.resolve();

  expect(seen).toEqual(["week"]);
  expect(selected(container)).toEqual(["Every week"]);
});

test("a disabled radio inside an enabled group never becomes the selection", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <RadioGroup aria-label="Report to" defaultValue="email" onValueChange={(next) => seen.push(next)}>
        <Radio value="email" label="Email" />
        <Radio value="none" label="Do not report" disabled />
      </RadioGroup>
    </HoronProvider>,
  );

  fireEvent.tap(radios(container)[1]);
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(selected(container)).toEqual(["Email"]);
});

test("a disabled group locks every radio it holds", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <RadioGroup aria-label="Priority" disabled onValueChange={(next) => seen.push(next)}>
        <Radio value="low" label="Low" />
        <Radio value="high" label="High" />
      </RadioGroup>
    </HoronProvider>,
  );
  expect(selected(container)).toEqual([]);

  fireEvent.tap(radios(container)[0]);
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(selected(container)).toEqual([]);
});

test("the group's rung decides the mark size unless a radio overrides it", () => {
  const { container } = render(
    <HoronProvider>
      <RadioGroup aria-label="Repeat" size="lg">
        <Radio value="day" label="Every day" />
        <Radio value="week" label="Every week" size="sm" />
      </RadioGroup>
    </HoronProvider>,
  );

  const [inherited, overridden] = radios(container);
  expect(inherited.querySelector(".size-6")).not.toBeNull();
  expect(overridden.querySelector(".size-4")).not.toBeNull();
});
