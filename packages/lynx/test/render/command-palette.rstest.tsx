declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { CommandPalette } from "../../src/components/command-palette";
import { HoronProvider } from "../../src/provider";

/** Calls the bound Lynx input handler with the event shape the engine sends (`detail.value`). */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const requireElement = (element: Element | null | undefined): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

const palette = (onOpenChange = rstest.fn(), onSelect = rstest.fn()) => (
  <HoronProvider scheme="light">
    <CommandPalette
      onOpenChange={onOpenChange}
      trigger={<text>Open palette</text>}
      groups={[
        {
          label: "Bots",
          items: [
            { value: "chief", label: "Chief of staff", meta: "Horon HQ", onSelect },
            { value: "inbox", label: "Inbox Manager" },
          ],
        },
        { label: "Actions", items: [{ value: "new", label: "New bot" }] },
      ]}
    />
  </HoronProvider>
);

test("the trigger opens the palette and a row tap runs the item handler and closes it", async () => {
  const onSelect = rstest.fn();
  const onOpenChange = rstest.fn();
  const { findByText, queryByText, queryByLabelText } = render(palette(onOpenChange, onSelect));

  expect(queryByText("Chief of staff")).toBeNull();

  fireEvent.tap(requireElement((await findByText("Open palette")).parentElement));

  expect(await findByText("Chief of staff")).toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(true);

  fireEvent.tap(requireElement((await findByText("Chief of staff")).parentElement));

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  expect(queryByText("Chief of staff")).toBeNull();
  expect(queryByLabelText("Bots")).toBeNull();
});

test("typing filters rows across groups and shows the empty message when nothing matches", async () => {
  const { container, findByText, queryByText } = render(palette());

  fireEvent.tap(requireElement((await findByText("Open palette")).parentElement));
  await findByText("Inbox Manager");

  const search = requireElement(container.querySelector("input"));
  await act(() => typeInto(search, "new"));

  expect(await findByText("New bot")).toBeInTheDocument();
  expect(queryByText("Inbox Manager")).toBeNull();
  expect(queryByText("Bots")).toBeNull();

  await act(() => typeInto(search, "zzz"));
  expect(await findByText("No results")).toBeInTheDocument();
});

test("a closed palette renders no scrim and no rows", async () => {
  const { container, findByText, queryByText } = render(palette());

  await findByText("Open palette");

  expect(queryByText("Inbox Manager")).toBeNull();
  expect(container.querySelector('[accessibility-label="Close"]')).toBeNull();
});
