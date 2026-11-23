import { AccessibilityInfo, Text } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { afterEach, expect, jest, test } from "@jest/globals";

import { HoronProvider, useHoronTheme } from "../../src/provider";

const originalReduceTransparency = Object.getOwnPropertyDescriptor(AccessibilityInfo, "isReduceTransparencyEnabled");
const originalAddEventListener = Object.getOwnPropertyDescriptor(AccessibilityInfo, "addEventListener");

function ThemeProbe() {
  const theme = useHoronTheme();
  return <Text>{`reduceTransparency:${String(theme.reduceTransparency)}`}</Text>;
}

afterEach(() => {
  if (originalReduceTransparency) {
    Object.defineProperty(AccessibilityInfo, "isReduceTransparencyEnabled", originalReduceTransparency);
  }
  if (originalAddEventListener) {
    Object.defineProperty(AccessibilityInfo, "addEventListener", originalAddEventListener);
  }
  jest.restoreAllMocks();
});

test("HoronProvider mounts and unmounts safely when web AccessibilityInfo omits isReduceTransparencyEnabled", async () => {
  Object.defineProperty(AccessibilityInfo, "isReduceTransparencyEnabled", {
    value: undefined,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(AccessibilityInfo, "addEventListener", {
    value: jest.fn(() => undefined),
    configurable: true,
    writable: true,
  });

  const { unmount } = await render(
    <HoronProvider scheme="light">
      <ThemeProbe />
    </HoronProvider>,
  );

  expect(screen.getByText("reduceTransparency:false")).toBeTruthy();
  await unmount();
});
