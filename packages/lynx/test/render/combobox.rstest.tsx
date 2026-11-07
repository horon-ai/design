declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Combobox, type ComboboxItemData } from "../../src/components/combobox";
import { HoronProvider } from "../../src/provider";
import { recordNativeWrites } from "./native-writes";

/** Lynx's `<input>` arrives in the test DOM as a real `HTMLInputElement`, so the bound handler is called
 * from the element's `eventMap` with the event shape the engine sends (`detail.value`). */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const bots: ComboboxItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage", keywords: ["email", "gmail"] },
  { value: "recruiter", label: "Recruiter", disabled: true },
];

const requireElement = (element: Element | null | undefined): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** Renders a combobox and returns the field box, which carries the anchor measurement and the open tap. */
const renderField = (element: React.ReactElement, label = "Bot") => {
  const result = render(<HoronProvider scheme="light">{element}</HoronProvider>);
  const box = requireElement(result.container.querySelector(`[accessibility-label="${label}"]`));
  return { ...result, box };
};

/** Opens the list: the popup only paints once the field has reported its box. */
const openList = (box: Element) => {
  fireEvent.layoutchange(box, { detail: { left: 16, top: 40, width: 240, height: 40 } });
  fireEvent.tap(box);
};

const searchField = (container: Element) => requireElement(container.querySelector("input"));

test("typing narrows the list and tapping a row reports the item value and closes the popup", async () => {
  const onValueChange = rstest.fn();
  const { box, container, findByText, getByText, queryByText } = renderField(
    <Combobox aria-label="Bot" items={bots} onValueChange={onValueChange} />,
  );

  openList(box);
  expect(await findByText("Chief of staff")).toBeInTheDocument();

  await act(() => typeInto(searchField(container), "wri"));
  expect(getByText("Writer")).toBeInTheDocument();
  expect(queryByText("Chief of staff")).toBeNull();

  fireEvent.tap(requireElement(requireElement(getByText("Writer")).parentElement));

  expect(onValueChange).toHaveBeenCalledWith("writer");
  expect(queryByText("Researcher")).toBeNull();
  expect(await findByText("Writer")).toBeInTheDocument();
});

test("keywords are searched too, and a query with no match shows the empty message", async () => {
  const { box, container, findByText, queryByText } = renderField(
    <Combobox aria-label="Bot" items={bots} emptyLabel="Nothing here" />,
  );

  openList(box);
  await findByText("Chief of staff");

  await act(() => typeInto(searchField(container), "gmail"));
  expect(await findByText("Inbox triage")).toBeInTheDocument();
  expect(queryByText("Writer")).toBeNull();

  await act(() => typeInto(searchField(container), "zzz"));
  expect(await findByText("Nothing here")).toBeInTheDocument();
});

test("a multiple combobox adds the tapped row to the selection and keeps the popup open", async () => {
  const onValueChange = rstest.fn();
  const { box, findByText, getAllByText } = renderField(
    <Combobox aria-label="Bots" items={bots} multiple defaultValue={["chief"]} onValueChange={onValueChange} />,
    "Bots",
  );

  openList(box);
  fireEvent.tap(requireElement((await findByText("Writer")).parentElement));

  expect(onValueChange).toHaveBeenCalledWith(["chief", "writer"]);
  // The chip and the row both read "Chief of staff", so the popup staying open shows twice.
  expect(getAllByText("Chief of staff")).toHaveLength(2);
});

test("a disabled combobox does not open its list on a tap", async () => {
  const { box, queryByText } = renderField(<Combobox aria-label="Bot" items={bots} disabled />);

  openList(box);

  expect(queryByText("Chief of staff")).toBeNull();
});

test("a multi-select pick empties the search field with the query", async () => {
  const recorder = recordNativeWrites();
  try {
    const { box, container, findByText, getByText, queryByText } = renderField(
      <Combobox aria-label="Bots" items={bots} multiple onValueChange={() => {}} />,
      "Bots",
    );

    openList(box);
    await findByText("Chief of staff");

    const field = searchField(container);
    await act(() => typeInto(field, "wri"));
    expect(getByText("Writer")).toBeInTheDocument();
    expect(queryByText("Chief of staff")).toBeNull();

    fireEvent.tap(requireElement(getByText("Writer").parentElement));

    // The popup stays open, but the query is gone, so the list shows every item again…
    expect(await findByText("Chief of staff")).toBeInTheDocument();
    expect(getByText("Researcher")).toBeInTheDocument();
    // …and the native search field was emptied too, not left showing "wri".
    const clears = recorder.writes.filter((write) => write.method === "setValue");
    expect(clears.length).toBeGreaterThan(0);
    expect(clears.at(-1)?.value).toBe("");
  } finally {
    recorder.restore();
  }
});
