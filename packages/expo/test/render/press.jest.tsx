import { fireEvent, render, screen } from "@testing-library/react-native";
import { beforeEach, expect, jest, test } from "@jest/globals";
import * as Haptics from "expo-haptics";

import { Button } from "../../src/components/button";
import { HoronPressable } from "../../src/lib/press";
import { HoronProvider } from "../../src/provider";

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: "light" },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("a press plays a light haptic while the provider has haptics on", async () => {
  await render(
    <HoronProvider>
      <Button>Save</Button>
    </HoronProvider>,
  );
  await fireEvent(screen.getByRole("button", { name: "Save" }), "pressIn");
  expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
});

test("haptics={false} on the provider silences every press", async () => {
  await render(
    <HoronProvider haptics={false}>
      <Button>Save</Button>
    </HoronProvider>,
  );
  await fireEvent(screen.getByRole("button", { name: "Save" }), "pressIn");
  expect(Haptics.impactAsync).not.toHaveBeenCalled();
});

test("a disabled control plays no haptic", async () => {
  await render(
    <HoronProvider>
      <Button disabled>Save</Button>
    </HoronProvider>,
  );
  await fireEvent(screen.getByRole("button", { name: "Save" }), "pressIn");
  expect(Haptics.impactAsync).not.toHaveBeenCalled();
});

test.each([false, true])("a style function receives the press state (pressScale %s)", async (pressScale) => {
  await render(
    <HoronProvider>
      <HoronPressable
        role="button"
        accessibilityLabel="Row"
        pressScale={pressScale}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      />
    </HoronProvider>,
  );
  const row = screen.getByRole("button", { name: "Row" });
  expect(row).toHaveStyle({ opacity: 1 });
  await fireEvent(row, "pressIn");
  expect(screen.getByRole("button", { name: "Row" })).toHaveStyle({ opacity: 0.5 });
});
