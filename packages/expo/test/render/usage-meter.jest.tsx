import { render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { UsageMeter } from "../../src/components/usage-meter";
import { HoronProvider } from "../../src/provider";

test("the meter reports its percentage to assistive technology", async () => {
  await render(
    <HoronProvider scheme="light">
      <UsageMeter label="Tasks" value={64} detail="6,420 of 10,000 tasks" />
    </HoronProvider>,
  );
  const meter = screen.getByRole("progressbar");
  expect(meter.props.accessibilityValue).toMatchObject({ min: 0, max: 100, now: 64 });
  expect(screen.getByLabelText("Tasks")).toBeTruthy();
});
