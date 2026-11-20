import { render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { PlanCard } from "../../src/components/plan-card";
import { HoronProvider } from "../../src/provider";

test("a set footer state is announced with the label the caller passed", async () => {
  await render(
    <HoronProvider scheme="light">
      <PlanCard title="Ship the parser" status="failed" statusLabel="Stopped · step 4 failed">
        {null}
      </PlanCard>
    </HoronProvider>,
  );
  const footer = screen.getByLabelText("Stopped · step 4 failed");
  expect(footer.props.accessibilityValue).toMatchObject({ text: "failed" });
});
