import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Combobox, type ComboboxItemData } from "../../src/components/combobox";
import { HoronProvider } from "../../src/provider";

const ITEMS: ComboboxItemData[] = [
  { value: "+82", label: "+82 South Korea", keywords: ["KR", "Korea"] },
  { value: "+81", label: "+81 Japan", keywords: ["JP"] },
  { value: "+1", label: "+1 United States", keywords: ["US"], disabled: true },
];

test("picking a row reports its value and closes the single-select popup", async () => {
  let picked: string | null = null;
  await render(
    <HoronProvider scheme="light">
      <Combobox aria-label="Country code" items={ITEMS} onValueChange={(value) => (picked = value)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("combobox", { name: "Country code" }));
  await fireEvent.press(screen.getByText("+81 Japan"));
  expect(picked).toBe("+81");
  expect(screen.queryByText("+82 South Korea")).toBeNull();
});

test("the popup narrows to the typed query and shows the empty label", async () => {
  await render(
    <HoronProvider scheme="light">
      <Combobox aria-label="Country code" items={ITEMS} />
    </HoronProvider>,
  );
  const field = screen.getByRole("combobox", { name: "Country code" });
  await fireEvent.press(field);
  const search = screen.getByPlaceholderText("Search");
  await fireEvent.changeText(search, "japan");
  expect(screen.getByText("+81 Japan")).toBeTruthy();
  expect(screen.queryByText("+82 South Korea")).toBeNull();
  await fireEvent.changeText(search, "zzz");
  expect(screen.getByText("No results")).toBeTruthy();
});

test("multiple mode toggles chips and reports the whole next selection", async () => {
  const selections: string[][] = [];
  await render(
    <HoronProvider scheme="light">
      <Combobox aria-label="Country codes" multiple items={ITEMS} onValueChange={(value) => selections.push(value)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("combobox", { name: "Country codes" }));
  await fireEvent.press(screen.getByText("+82 South Korea"));
  await fireEvent.press(screen.getByText("+81 Japan"));
  expect(selections.at(-1)).toEqual(["+82", "+81"]);
  await fireEvent.press(screen.getByRole("button", { name: "Remove +82 South Korea" }));
  expect(selections.at(-1)).toEqual(["+81"]);
});
