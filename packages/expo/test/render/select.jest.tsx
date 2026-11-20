import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Select } from "../../src/components/select";
import { HoronProvider } from "../../src/provider";

const ITEMS = [
  { value: "kr", label: "South Korea", selectedLabel: "+82" },
  { value: "jp", label: "Japan", selectedLabel: "+81" },
  { value: "us", label: "United States", disabled: true },
];

test("tapping the trigger opens the list and picking a row reports its value and closes", async () => {
  let picked: string | null = null;
  await render(
    <HoronProvider scheme="light">
      <Select aria-label="Country" items={ITEMS} onValueChange={(value) => (picked = value)} />
    </HoronProvider>,
  );
  const trigger = screen.getByRole("combobox", { name: "Country" });
  expect(trigger.props.accessibilityState).toMatchObject({ expanded: false });
  await fireEvent.press(trigger);
  expect(screen.getByRole("combobox", { name: "Country" }).props.accessibilityState).toMatchObject({ expanded: true });
  await fireEvent.press(screen.getByText("Japan"));
  expect(picked).toBe("jp");
  expect(screen.getByRole("combobox", { name: "Country" }).props.accessibilityState).toMatchObject({ expanded: false });
});

test("a disabled row cannot be picked", async () => {
  let picks = 0;
  await render(
    <HoronProvider scheme="light">
      <Select aria-label="Country" items={ITEMS} onValueChange={() => (picks += 1)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("combobox", { name: "Country" }));
  await fireEvent.press(screen.getByText("United States"));
  expect(picks).toBe(0);
  expect(screen.getByRole("combobox", { name: "Country" }).props.accessibilityState).toMatchObject({ expanded: true });
});

test("a disabled select never opens its list", async () => {
  await render(
    <HoronProvider scheme="light">
      <Select aria-label="Country" items={ITEMS} disabled />
    </HoronProvider>,
  );
  const trigger = screen.getByRole("combobox", { name: "Country" });
  expect(trigger.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(trigger);
  expect(screen.queryByText("Japan")).toBeNull();
});

test("a controlled select shows the chosen label and reports requests without moving on its own", async () => {
  const changes: boolean[] = [];
  await render(
    <HoronProvider scheme="light">
      <Select
        aria-label="Country"
        items={ITEMS}
        value="kr"
        open={false}
        onOpenChange={(open) => changes.push(open)}
      />
    </HoronProvider>,
  );
  expect(screen.getByText("+82")).toBeTruthy();
  await fireEvent.press(screen.getByRole("combobox", { name: "Country" }));
  expect(changes).toEqual([true]);
  expect(screen.getByRole("combobox", { name: "Country" }).props.accessibilityState).toMatchObject({ expanded: false });
});
