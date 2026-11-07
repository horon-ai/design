declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Composer } from "../../src/components/composer";
import { HoronProvider } from "../../src/provider";

/** Lynx's `<textarea>` is a real `HTMLTextAreaElement` in the test DOM, so the bound handler is called directly. */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const field = (container: HTMLElement): Element => {
  const found = container.querySelector("textarea");
  if (!found) throw new Error("no composer field rendered");
  return found;
};

const sendButton = (container: HTMLElement): Element => {
  const found = container.querySelector("[accessibility-label='Send']");
  if (!found) throw new Error("no send button rendered");
  return found;
};

test("tapping send reports the typed text and clears the field", async () => {
  const onSubmit = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Composer placeholder="Message" onSubmit={onSubmit} />
    </HoronProvider>,
  );

  // An empty field offers the voice action, not a send button.
  expect(container.querySelector("[accessibility-label='Send']")).toBeNull();
  expect(container.querySelector("[accessibility-label='Voice input']")).not.toBeNull();

  await act(() => typeInto(field(container), "Book the room"));

  fireEvent.tap(sendButton(container));

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith("Book the room");
  // The value was cleared, so the slot is back to the voice action.
  expect(container.querySelector("[accessibility-label='Send']")).toBeNull();
  expect(container.querySelector("[accessibility-label='Voice input']")).not.toBeNull();
});

test("the confirm key submits the typed text", async () => {
  const onSubmit = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Composer placeholder="Message" onSubmit={onSubmit} />
    </HoronProvider>,
  );

  await act(() => typeInto(field(container), "  Ship the parser  "));

  const handler = field(container).eventMap?.["bindEvent:confirm"];
  if (!handler) throw new Error("no bindconfirm handler on the element");
  await act(() => handler({ type: "bindEvent:confirm", detail: { value: "  Ship the parser  " } }));

  // The untrimmed value reaches the caller, exactly as react's submit did.
  expect(onSubmit).toHaveBeenCalledWith("  Ship the parser  ");
});

test("whitespace-only text never submits", async () => {
  const onSubmit = rstest.fn();
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Composer placeholder="Message" onSubmit={onSubmit} onValueChange={onValueChange} />
    </HoronProvider>,
  );

  await act(() => typeInto(field(container), "   "));

  expect(onValueChange).toHaveBeenCalledWith("   ");
  // No send slot was offered, so the field could only have been submitted by the soft keyboard.
  expect(container.querySelector("[accessibility-label='Send']")).toBeNull();

  const handler = field(container).eventMap?.["bindEvent:confirm"];
  await act(() => handler?.({ type: "bindEvent:confirm", detail: { value: "   " } }));

  expect(onSubmit).not.toHaveBeenCalled();
});

test("a disabled composer drops the attach and voice taps", () => {
  const onAttach = rstest.fn();
  const onVoice = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <Composer placeholder="Message" disabled onAttach={onAttach} onVoice={onVoice} />
    </HoronProvider>,
  );

  const attach = container.querySelector("[accessibility-label='Attach']")!;
  const voice = container.querySelector("[accessibility-label='Voice input']")!;

  expect(attach.getAttribute("accessibility-traits")).toBe("disabled");
  fireEvent.tap(attach);
  fireEvent.tap(voice);

  expect(onAttach).not.toHaveBeenCalled();
  expect(onVoice).not.toHaveBeenCalled();
  expect(field(container)).toHaveAttribute("disabled");
  // The soft keyboard's send key is labelled "send", matching react's Enter submit.
  expect(field(container).getAttribute("confirm-type")).toBe("send");
});
