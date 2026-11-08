import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Field, FieldDescription, FieldError, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";
import { HoronProvider } from "../../src/provider";

const renderField = (element: React.ReactElement) => render(<HoronProvider scheme="light">{element}</HoronProvider>);

test("an invalid field marks the control inside it and shows the error", () => {
  const { container } = renderField(
    <Field invalid>
      <FieldLabel>Bot name</FieldLabel>
      <Input defaultValue="Inbox Manager" />
      <FieldError>Name is already used by another bot.</FieldError>
    </Field>,
  );

  expect(container.textContent).toContain("Bot name");
  expect(container.textContent).toContain("Name is already used by another bot.");
  expect(container.querySelector(".border-border-danger")).not.toBeNull();
});

test("a valid field keeps the error closed", () => {
  const { container } = renderField(
    <Field>
      <FieldLabel>Bot name</FieldLabel>
      <Input placeholder="Bot name" />
      <FieldDescription>Shown in chat.</FieldDescription>
      <FieldError>Name is already used by another bot.</FieldError>
    </Field>,
  );

  expect(container.textContent).toContain("Shown in chat.");
  expect(container.textContent).not.toContain("Name is already used by another bot.");
  expect(container.querySelector(".border-border-danger")).toBeNull();
});

test("a disabled field disables the control inside it", () => {
  const { container } = renderField(
    <Field disabled>
      <FieldLabel>Bot name</FieldLabel>
      <Input placeholder="Bot name" />
    </Field>,
  );

  expect(container.querySelector("input")).toHaveAttribute("disabled");
});

test("match shows the error without an invalid field", () => {
  const { container } = renderField(
    <Field>
      <FieldLabel>Handle</FieldLabel>
      <Input placeholder="Handle" />
      <FieldError match>Use at least 3 characters.</FieldError>
    </Field>,
  );

  expect(container.textContent).toContain("Use at least 3 characters.");
});

test("a passed style reaches the field stack", () => {
  const { container } = renderField(<Field style={{ marginTop: "7px" }} />);
  // The provider's theme root is the container's first element; the field stack is its first child.
  expect(container.firstElementChild?.firstElementChild).toHaveStyle({ marginTop: "7px" });
});

test("a passed style reaches the label", async () => {
  const { findByText } = renderField(
    <Field>
      <FieldLabel style={{ marginTop: "7px" }}>Bot name</FieldLabel>
    </Field>,
  );

  expect(await findByText("Bot name")).toHaveStyle({ marginTop: "7px" });
});

test("a passed style reaches the description", async () => {
  const { findByText } = renderField(
    <Field>
      <FieldDescription style={{ marginTop: "7px" }}>Shown in chat.</FieldDescription>
    </Field>,
  );

  expect(await findByText("Shown in chat.")).toHaveStyle({ marginTop: "7px" });
});

test("a passed style reaches the error row", async () => {
  const { findByText } = renderField(
    <Field>
      <FieldError match style={{ marginTop: "7px" }}>
        Use at least 3 characters.
      </FieldError>
    </Field>,
  );

  const message = await findByText("Use at least 3 characters.");
  expect(message.parentElement).toHaveStyle({ marginTop: "7px" });
});
