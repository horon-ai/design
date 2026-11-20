import { useState } from "react";
import { View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Field, FieldError, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";
import { HoronProvider } from "../../src/provider";

/** A field wired to state, the way a form echoes every keystroke it is handed. */
function EmailField() {
  const [value, setValue] = useState("");
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input value={value} onChange={setValue} />
      <FieldError>Enter a valid address.</FieldError>
    </Field>
  );
}

test("typing into a Field's Input reports the text and names the field after its label", async () => {
  await render(
    <HoronProvider scheme="light">
      <EmailField />
    </HoronProvider>,
  );
  const input = screen.getByLabelText("Email");
  await fireEvent.changeText(input, "you@example.com");
  expect(screen.getByDisplayValue("you@example.com")).toBeTruthy();
});

test("a disabled Input announces itself as disabled and ignores typing", async () => {
  let typed = "";
  await render(
    <HoronProvider scheme="light">
      <Input accessibilityLabel="Slug" disabled onChange={(text) => (typed = text)} />
    </HoronProvider>,
  );
  const input = screen.getByLabelText("Slug");
  await fireEvent.changeText(input, "horon");
  expect(typed).toBe("");
  expect(input.props.editable).toBe(false);
});

test("an invalid Field shows its error and keeps it hidden while valid", async () => {
  const { rerender } = await render(
    <HoronProvider scheme="light">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input />
      </Field>
    </HoronProvider>,
  );
  expect(screen.queryByText("Required.")).toBeNull();
  await rerender(
    <HoronProvider scheme="light">
      <Field invalid>
        <FieldLabel>Name</FieldLabel>
        <Input />
        <FieldError>Required.</FieldError>
      </Field>
    </HoronProvider>,
  );
  expect(screen.getByText("Required.")).toBeTruthy();
});

test("a read-only Input keeps its text but never reports an edit", async () => {
  let typed = "";
  await render(
    <HoronProvider scheme="light">
      <View>
        <Input accessibilityLabel="Key" value="sk-123" readOnly onChange={(text) => (typed = text)} />
      </View>
    </HoronProvider>,
  );
  const input = screen.getByLabelText("Key");
  await fireEvent.changeText(input, "sk-456");
  expect(typed).toBe("");
  expect(input.props.editable).toBe(false);
});
