import { render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Banner } from "../../src/components/banner";
import { HoronProvider } from "../../src/provider";

test("a danger banner is announced as an alert and an info banner is not", async () => {
  await render(
    <HoronProvider scheme="light">
      <Banner tone="danger">Your API key expired.</Banner>
      <Banner>Storage is shared.</Banner>
    </HoronProvider>,
  );
  expect(screen.getAllByRole("alert")).toHaveLength(1);
  expect(screen.getByText("Storage is shared.")).toBeTruthy();
});
