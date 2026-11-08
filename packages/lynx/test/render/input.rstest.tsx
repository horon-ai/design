declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Input } from "../../src/components/input";
import { recordNativeWrites } from "./native-writes";
import { HoronProvider } from "../../src/provider";

/**
 * Lynx's `<input>` arrives in the test DOM as a real `HTMLInputElement`, which
 * the testing library's `fireEvent` refuses, so the bound handler is called from
 * the element's `eventMap` with the event shape the engine sends (`detail.value`).
 */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const renderField = (element: React.ReactElement) => {
  const result = render(<HoronProvider scheme="light">{element}</HoronProvider>);
  const field = result.container.querySelector("input");
  if (!field) throw new Error("no input rendered");
  return { ...result, field };
};

test("typing calls onChange with the new value", () => {
  const onChange = rstest.fn();
  const { field } = renderField(<Input placeholder="Search" onChange={onChange} />);

  typeInto(field, "hello");

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("hello");
});

test("onValueChange reports the text and the change reason alongside onChange", () => {
  const onChange = rstest.fn();
  const onValueChange = rstest.fn();
  const { field } = renderField(<Input placeholder="Search" onChange={onChange} onValueChange={onValueChange} />);

  typeInto(field, "hello");

  expect(onChange).toHaveBeenCalledWith("hello");
  expect(onValueChange).toHaveBeenCalledWith("hello", { reason: "input" });
});

test("a disabled input calls neither change handler", () => {
  const onValueChange = rstest.fn();
  const { field } = renderField(<Input disabled placeholder="Search" onValueChange={onValueChange} />);

  typeInto(field, "nope");

  expect(onValueChange).not.toHaveBeenCalled();
});

test("the uncontrolled default text is rendered on the field", () => {
  const { field } = renderField(<Input defaultValue="Inbox Manager" placeholder="Search" />);

  expect(field.getAttribute("default-value")).toBe("Inbox Manager");
  expect(field.getAttribute("placeholder")).toBe("Search");
});

test("a disabled input never emits", () => {
  const onChange = rstest.fn();
  const { field } = renderField(<Input disabled placeholder="Search" onChange={onChange} />);

  typeInto(field, "nope");

  expect(field).toHaveAttribute("disabled");
  expect(onChange).not.toHaveBeenCalled();
});

test("a caller style is merged onto the box", () => {
  const { container } = renderField(<Input placeholder="Search" style={{ width: "240px" }} />);

  expect(container.querySelector(".rounded-md")?.getAttribute("style")).toContain("width: 240px");
});

test("invalid paints the danger border and the class split lands on both parts", () => {
  const { container, field } = renderField(<Input invalid className="w-44" inputClassName="extra" />);

  expect(container.querySelector(".border-border-danger")).not.toBeNull();
  expect(field).toHaveClass("extra");
});

test("an echoed controlled value is not written back, but a foreign one is", async () => {
  const recorder = recordNativeWrites();
  try {
    const onChange = rstest.fn();
    const view = (value: string) => (
      <HoronProvider scheme="light">
        <Input value={value} onChange={onChange} />
      </HoronProvider>
    );
    const written = () => recorder.writes.filter((call) => call.method === "setValue").map((call) => call.value);

    const result = render(view("a"));
    const field = result.container.querySelector("input");
    if (!field) throw new Error("no input rendered");
    // The mount value is unknown to the editor, so it is written once.
    await act(() => {});
    expect(written()).toEqual(["a"]);

    // The parent echoes the keystroke it was just handed: the editor already holds
    // that text, so writing it back would jump the caret to the end.
    await act(() => typeInto(field, "ab"));
    result.rerender(view("ab"));
    await act(() => {});
    expect(written()).toEqual(["a"]);

    // A value the editor never typed (a form reset) is still written.
    result.rerender(view("reset"));
    await act(() => {});
    expect(written()).toEqual(["a", "reset"]);
  } finally {
    recorder.restore();
  }
});
