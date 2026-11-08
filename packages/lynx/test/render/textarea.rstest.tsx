declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Textarea } from "../../src/components/textarea";
import { HoronProvider } from "../../src/provider";

/** Lynx's `<textarea>` is a real `HTMLTextAreaElement` in the test DOM, so the bound handler is called directly. */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

function focusElement(element: Element) {
  element.eventMap?.["bindEvent:focus"]?.({ type: "bindEvent:focus", detail: { value: "" } });
}

const renderField = (element: React.ReactElement) => {
  const result = render(<HoronProvider scheme="light">{element}</HoronProvider>);
  const field = result.container.querySelector("textarea");
  if (!field) throw new Error("no textarea rendered");
  return { ...result, field };
};

test("typing calls onChange with the new value", () => {
  const onChange = rstest.fn();
  const { field } = renderField(<Textarea placeholder="Add a note" onChange={onChange} />);

  typeInto(field, "first line");

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("first line");
});

test("focus draws the focus ring on the box, not on the editor", async () => {
  const { container, field } = renderField(<Textarea placeholder="Add a note" />);

  await act(() => focusElement(field));

  const box = container.querySelector(".rounded-md");
  expect(box?.getAttribute("style")).toContain("box-shadow");
});

test("a disabled textarea never emits", () => {
  const onChange = rstest.fn();
  const { field } = renderField(<Textarea disabled placeholder="Add a note" onChange={onChange} />);

  typeInto(field, "nope");

  expect(field).toHaveAttribute("disabled");
  expect(onChange).not.toHaveBeenCalled();
});

test("a textarea without the invalid flag keeps the default border", () => {
  const { container } = renderField(<Textarea placeholder="Add a note" />);

  expect(container.querySelector(".border-border-danger")).toBeNull();
  expect(container.querySelector(".border-border-default")).not.toBeNull();
});

test("an invalid textarea paints the danger border", () => {
  const { container } = renderField(<Textarea invalid placeholder="Add a note" />);

  expect(container.querySelector(".border-border-danger")).not.toBeNull();
});
