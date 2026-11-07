declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { TextareaField } from "../../src/components/textarea-field";
import { HoronProvider } from "../../src/provider";

/** Lynx's `<textarea>` is a real `HTMLTextAreaElement` in the test DOM, so the bound handler is called directly. */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const renderField = (element: React.ReactElement) => {
  const result = render(<HoronProvider scheme="light">{element}</HoronProvider>);
  const field = result.container.querySelector("textarea");
  if (!field) throw new Error("no textarea rendered");
  return { ...result, field };
};

test("the counter follows typing", async () => {
  const onChange = rstest.fn();
  const { container, field } = renderField(
    <TextareaField label="Instructions" hint="Optional" description="The bot reads this." maxLength={240} onChange={onChange} />,
  );

  expect(container.textContent).toContain("0 / 240");

  await act(() => typeInto(field, "Skip newsletters."));

  expect(onChange).toHaveBeenCalledWith("Skip newsletters.");
  expect(container.textContent).toContain("17 / 240");
});

test("an error replaces the description and turns the footer red", () => {
  const { container } = renderField(
    <TextareaField label="Instructions" description="The bot reads this." error="Add at least 40 characters." maxLength={240} />,
  );

  expect(container.textContent).toContain("Add at least 40 characters.");
  expect(container.textContent).not.toContain("The bot reads this.");
  expect(container.querySelector(".border-border-danger")).not.toBeNull();
});

test("a disabled field never emits and dims", () => {
  const onChange = rstest.fn();
  const { container, field } = renderField(
    <TextareaField label="Instructions" defaultValue="Skip newsletters." disabled onChange={onChange} />,
  );

  typeInto(field, "nope");

  expect(onChange).not.toHaveBeenCalled();
  expect(field).toHaveAttribute("disabled");
  expect(container.querySelector(".opacity-60")).not.toBeNull();
});

test("the counter starts from a controlled value", () => {
  const { container } = renderField(<TextareaField label="Instructions" value="Skip" maxLength={40} />);

  expect(container.textContent).toContain("4 / 40");
});
