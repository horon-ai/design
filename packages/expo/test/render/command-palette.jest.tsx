import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { CommandPalette, type CommandGroup } from "../../src/components/command-palette";
import { HoronProvider } from "../../src/provider";

const GROUPS: CommandGroup[] = [
  {
    label: "Bots",
    items: [
      { value: "weekly", label: "Weekly digest", keywords: "summary mail" },
      { value: "inbox", label: "Inbox triage", keywords: "sort" },
    ],
  },
  {
    label: "Workspaces",
    items: [{ value: "acme", label: "Acme", meta: "12 members" }],
  },
];

test("pressing a row runs its own onSelect and then closes the palette", async () => {
  const events: string[] = [];
  const groups = GROUPS.map((group) => ({
    label: group.label,
    items: group.items.map((item) =>
      item.value === "weekly" ? { ...item, onSelect: () => events.push("weekly") } : item,
    ),
  }));
  const seen: boolean[] = [];

  await render(
    <HoronProvider scheme="light">
      <CommandPalette
        onOpenChange={(open) => seen.push(open)}
        trigger={<></>}
        groups={groups}
        placeholder="Search bots"
      />
    </HoronProvider>,
  );

  await fireEvent.press(screen.getByRole("button", { name: "Search bots" }));
  expect(seen).toEqual([true]);

  await fireEvent.press(screen.getByRole("button", { name: "Weekly digest" }));
  expect(events).toEqual(["weekly"]);
  expect(seen).toEqual([true, false]);
  expect(screen.queryByText("Weekly digest")).toBeNull();
});

test("the query filters on label and keywords, and the empty state shows when nothing matches", async () => {
  await render(
    <HoronProvider scheme="light">
      <CommandPalette groups={GROUPS} trigger={<></>} placeholder="Search bots" empty="Nothing here" />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Search bots" }));

  await fireEvent.changeText(screen.getByPlaceholderText("Search bots"), "sort");
  expect(screen.getByText("Inbox triage")).toBeTruthy();
  expect(screen.queryByText("Acme")).toBeNull();

  await fireEvent.changeText(screen.getByPlaceholderText("Search bots"), "zzz");
  expect(screen.getByText("Nothing here")).toBeTruthy();
});
