declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { InputGroup, InputGroupSegment } from "../../src/components/input-group";
import { HoronProvider } from "../../src/provider";

/** Lynx's `<input>` is a real `HTMLInputElement` in the test DOM, so the bound handler is called directly. */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const renderGroup = (element: React.ReactElement) => {
  const result = render(<HoronProvider scheme="light">{element}</HoronProvider>);
  const field = result.container.querySelector("input");
  if (!field) throw new Error("no input rendered");
  return { ...result, field };
};

test("the prefix and suffix segments frame the input and typing emits", () => {
  const onChange = rstest.fn();
  const { container, field } = renderGroup(
    <InputGroup
      placeholder="Website"
      onChange={onChange}
      prefix={
        <InputGroupSegment>
          <text>https://</text>
        </InputGroupSegment>
      }
      suffix={
        <InputGroupSegment>
          <text>.ai</text>
        </InputGroupSegment>
      }
    />,
  );

  expect(container.textContent).toContain("https://");
  expect(container.textContent).toContain(".ai");

  typeInto(field, "horon");

  expect(onChange).toHaveBeenCalledWith("horon");
});

test("a disabled group disables the input and never emits", () => {
  const onChange = rstest.fn();
  const { container, field } = renderGroup(
    <InputGroup
      placeholder="Phone number"
      disabled
      onChange={onChange}
      prefix={
        <InputGroupSegment>
          <text>+82</text>
        </InputGroupSegment>
      }
    />,
  );

  typeInto(field, "nope");

  expect(field).toHaveAttribute("disabled");
  expect(onChange).not.toHaveBeenCalled();
  expect(container.querySelector(".opacity-60")).not.toBeNull();
});

test("an invalid group paints the danger border and the hairline", () => {
  const { container } = renderGroup(
    <InputGroup
      invalid
      defaultValue="12"
      suffix={
        <InputGroupSegment>
          <text>KRW</text>
        </InputGroupSegment>
      }
    />,
  );

  expect(container.querySelector(".border-border-danger")).not.toBeNull();
  expect(container.querySelector(".bg-border-danger")).not.toBeNull();
});

test("a segment outside a group falls back to the md rung", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <InputGroupSegment>
        <text>+82</text>
      </InputGroupSegment>
    </HoronProvider>,
  );

  const segment = container.querySelector(".bg-overlay-ink-4");
  expect(segment).not.toBeNull();
  expect(segment).toHaveClass("text-body-md");
});
