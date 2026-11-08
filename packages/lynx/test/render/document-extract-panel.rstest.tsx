import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { DocumentExtractPanel } from "../../src/components/document-extract-panel";
import { HoronProvider } from "../../src/provider";

const groups = [
  {
    id: "invoice",
    label: "Invoice",
    fields: [
      { id: "vendor", label: "Vendor", value: "Larkspur Studio GmbH", type: "Text" },
      { id: "due", label: "Due date", value: "2026-11-13", type: "Date", status: "check" as const },
    ],
  },
];

/** The pressable node carrying an accessible name, as the row confirmation and the zoom steps do. */
const byLabel = (container: HTMLElement, label: string): Element => {
  const node = container.querySelector(`[accessibility-label='${label}']`);
  if (!node) throw new Error(`no control named ${label}`);
  return node;
};

/** The pressable node whose own text is exactly `label`. */
const byText = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) => element.getAttribute("accessibility-traits") !== null && (element.textContent ?? "").trim() === label,
  );
  if (!node) throw new Error(`no control labelled ${label}`);
  return node;
};

test("confirming a checked row moves the footer counters, and Accept all clears the rest", async () => {
  const onAcceptAll = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel
        fileName="larkspur-invoice.pdf"
        sheet={<view />}
        groups={groups}
        onAcceptAll={onAcceptAll}
      />
    </HoronProvider>,
  );

  expect(getByText("1 of 2 filled · 1 to check")).toBeInTheDocument();

  fireEvent.tap(byLabel(container, "Confirm Due date"));
  await Promise.resolve();
  expect(getByText("2 of 2 filled · 0 to check")).toBeInTheDocument();

  fireEvent.tap(byText(container, "Accept all"));
  await Promise.resolve();
  expect(onAcceptAll).toHaveBeenCalledTimes(1);
});

test("the JSON view writes the extracted fields as an object", async () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel fileName="larkspur-invoice.pdf" sheet={<view />} groups={groups} />
    </HoronProvider>,
  );

  fireEvent.tap(byText(container, "JSON"));
  await Promise.resolve();

  expect(getByText(/"Vendor": "Larkspur Studio GmbH"/)).toBeInTheDocument();
  expect(getByText(/"Due date": "2026-11-13"/)).toBeInTheDocument();
});

test("at the top of the zoom range the zoom-in step is disabled and the sheet stays put", async () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel fileName="larkspur-invoice.pdf" sheet={<view />} groups={groups} defaultZoom={150} />
    </HoronProvider>,
  );

  expect(getByText("150%")).toBeInTheDocument();
  expect(byLabel(container, "Zoom in").getAttribute("accessibility-traits")).toBe("disabled");

  fireEvent.tap(byLabel(container, "Zoom in"));
  await Promise.resolve();
  expect(getByText("150%")).toBeInTheDocument();

  fireEvent.tap(byLabel(container, "Fit"));
  await Promise.resolve();
  expect(getByText("70%")).toBeInTheDocument();
});
