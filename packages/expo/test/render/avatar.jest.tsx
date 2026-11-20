import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Avatar } from "../../src/components/avatar";
import { HoronProvider } from "../../src/provider";

test("a broken image keeps the initials instead of showing a broken box", async () => {
  await render(
    <HoronProvider scheme="light">
      <Avatar type="image" src="https://example.test/photo.png" alt="Min-yeol">
        HM
      </Avatar>
    </HoronProvider>,
  );
  await fireEvent(screen.getByLabelText("Min-yeol"), "error");
  expect(screen.getByText("HM")).toBeTruthy();
});

test("a loaded image replaces the initials", async () => {
  await render(
    <HoronProvider scheme="light">
      <Avatar type="image" src="https://example.test/photo.png" alt="Min-yeol">
        HM
      </Avatar>
    </HoronProvider>,
  );
  expect(screen.getByText("HM")).toBeTruthy();
  await fireEvent(screen.getByLabelText("Min-yeol"), "load");
  expect(screen.queryByText("HM")).toBeNull();
});
