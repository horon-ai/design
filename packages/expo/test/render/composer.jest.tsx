import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { Composer } from "../../src/components/composer";
import { HoronProvider } from "../../src/provider";

test("typing fills the composer and the send button hands over the text and clears the field", async () => {
  const onSubmit = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <Composer onSubmit={onSubmit} />
    </HoronProvider>,
  );
  const field = screen.getByLabelText("Message");
  await fireEvent.changeText(field, "Book the design review");
  await fireEvent.press(screen.getByRole("button", { name: "Send" }));
  expect(onSubmit).toHaveBeenCalledWith("Book the design review");
  expect(screen.getByLabelText("Message").props.value).toBe("");
});

test("whitespace-only text keeps the voice action and never reaches onValueChange's send path", async () => {
  const onSubmit = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <Composer onSubmit={onSubmit} />
    </HoronProvider>,
  );
  await fireEvent.changeText(screen.getByLabelText("Message"), "   ");
  expect(screen.getByRole("button", { name: "Voice input" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Voice input" }));
  expect(onSubmit).not.toHaveBeenCalled();
});

test("a disabled composer reports no typing", async () => {
  const onValueChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <Composer disabled onValueChange={onValueChange} />
    </HoronProvider>,
  );
  await fireEvent.changeText(screen.getByLabelText("Message"), "blocked");
  expect(onValueChange).not.toHaveBeenCalled();
});
