import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { TextareaField } from "../../src/components/textarea-field";
import { HoronProvider } from "../../src/provider";

test("the counter follows the typed length up to its maximum", async () => {
  await render(
    <HoronProvider scheme="light">
      <TextareaField label="Instructions" maxLength={10} />
    </HoronProvider>,
  );
  expect(screen.getByText("0 / 10")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Instructions"), "ab cde");
  expect(screen.getByText("6 / 10")).toBeTruthy();
});

test("a controlled value drives the counter without an edit", async () => {
  const { rerender } = await render(
    <HoronProvider scheme="light">
      <TextareaField label="Instructions" maxLength={20} value="hello" onChange={() => undefined} />
    </HoronProvider>,
  );
  expect(screen.getByText("5 / 20")).toBeTruthy();
  await rerender(
    <HoronProvider scheme="light">
      <TextareaField label="Instructions" maxLength={20} value="hello there" onChange={() => undefined} />
    </HoronProvider>,
  );
  expect(screen.getByText("11 / 20")).toBeTruthy();
});

test("an error replaces the description and the field reports it to assistive tech", async () => {
  await render(
    <HoronProvider scheme="light">
      <TextareaField label="Instructions" description="Tell the bot how to answer." error="Too short." />
    </HoronProvider>,
  );
  expect(screen.getByText("Too short.")).toBeTruthy();
  expect(screen.queryByText("Tell the bot how to answer.")).toBeNull();
  expect(screen.getByLabelText("Instructions").props.accessibilityHint).toBe("Too short.");
});
