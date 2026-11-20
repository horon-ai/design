import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { DocumentExtractPanel } from "../../src/components/document-extract-panel";
import { HoronProvider } from "../../src/provider";

const groups = [
  {
    id: "vendor",
    label: "Vendor",
    fields: [
      { id: "name", label: "Name", value: "Northwind Supply", type: "Text" },
      { id: "due", label: "Due", value: "Oct 24, 2026", type: "Date", status: "check" as const },
    ],
  },
];

test("confirming a flagged row clears it from the to-check count", async () => {
  await render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel fileName="invoice.pdf" groups={groups} sheet={<Text>Northwind Supply</Text>} />
    </HoronProvider>,
  );
  expect(screen.getByText("1 of 2 filled · 1 to check")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Confirm Due" }));
  expect(screen.getByText("2 of 2 filled · 0 to check")).toBeTruthy();
});

test("Accept all confirms every row and reports the acceptance", async () => {
  const onAcceptAll = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel
        fileName="invoice.pdf"
        groups={groups}
        sheet={<Text>Northwind Supply</Text>}
        onAcceptAll={onAcceptAll}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Accept all" }));
  expect(onAcceptAll).toHaveBeenCalledTimes(1);
  expect(screen.getByText("2 of 2 filled · 0 to check")).toBeTruthy();
});

test("zoom steps by ten and Fit returns to the design size", async () => {
  await render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel fileName="invoice.pdf" groups={groups} sheet={<Text>Northwind Supply</Text>} />
    </HoronProvider>,
  );
  expect(screen.getByText("70%")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Zoom in" }));
  expect(screen.getByText("80%")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Fit" }));
  expect(screen.getByText("70%")).toBeTruthy();
});

test("the JSON view prints the extracted values", async () => {
  await render(
    <HoronProvider scheme="light">
      <DocumentExtractPanel fileName="invoice.pdf" groups={groups} sheet={<Text>Northwind Supply</Text>} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("tab", { name: "JSON" }));
  expect(screen.getByText(/"Name": "Northwind Supply"/)).toBeTruthy();
});
