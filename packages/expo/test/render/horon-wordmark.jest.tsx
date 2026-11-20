import { render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { HoronWordmark } from "../../src/components/horon-wordmark";
import { HoronProvider } from "../../src/provider";

test("the wordmark is announced as one image under its title", async () => {
  await render(
    <HoronProvider scheme="light">
      <HoronWordmark />
      <HoronWordmark title="Horon design system" />
    </HoronProvider>,
  );
  expect(screen.getByLabelText("Horon")).toBeTruthy();
  expect(screen.getByLabelText("Horon design system")).toBeTruthy();
});
