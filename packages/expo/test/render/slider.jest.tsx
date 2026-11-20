import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Slider } from "../../src/components/slider";
import { HoronProvider } from "../../src/provider";

test("the increment and decrement actions step a Slider by its step and report it", async () => {
  const values: number[] = [];
  await render(
    <HoronProvider scheme="light">
      <Slider aria-label="Volume" defaultValue={40} step={5} max={50} onValueChange={(next) => values.push(next)} />
    </HoronProvider>,
  );
  const slider = screen.getByRole("slider", { name: "Volume" });
  await fireEvent(slider, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
  await fireEvent(slider, "accessibilityAction", { nativeEvent: { actionName: "decrement" } });
  expect(values).toEqual([45, 40]);
});

test("a Slider stops at the end of its range", async () => {
  const values: number[] = [];
  await render(
    <HoronProvider scheme="light">
      <Slider aria-label="Zoom" value={100} onValueChange={(next) => values.push(next)} />
    </HoronProvider>,
  );
  await fireEvent(screen.getByRole("slider", { name: "Zoom" }), "accessibilityAction", {
    nativeEvent: { actionName: "increment" },
  });
  expect(values).toEqual([]);
});
