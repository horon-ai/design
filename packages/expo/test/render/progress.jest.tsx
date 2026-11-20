import { render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Progress } from "../../src/components/progress";
import { HoronProvider } from "../../src/provider";

test("a determinate Progress announces its range and current value", async () => {
  await render(
    <HoronProvider scheme="light">
      <Progress value={64} aria-label="Upload" />
    </HoronProvider>,
  );
  const bar = screen.getByRole("progressbar", { name: "Upload" });
  expect(bar.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 64 });
});

test("an indeterminate Progress announces its range without a value", async () => {
  await render(
    <HoronProvider scheme="light">
      <Progress aria-label="Loading" />
    </HoronProvider>,
  );
  const bar = screen.getByRole("progressbar", { name: "Loading" });
  expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100 });
});
