import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Menu, MenuContent, MenuItem, MenuLabel, MenuTrigger } from "../../src/components/menu";
import { HoronProvider } from "../../src/provider";

/** A menu with one live row and one blocked row. */
function AccountMenu({ onPick }: { onPick?: (row: string) => void }) {
  return (
    <Menu>
      <MenuTrigger>Account</MenuTrigger>
      <MenuContent>
        <MenuLabel>Workspaces</MenuLabel>
        <MenuItem onClick={() => onPick?.("settings")}>Settings</MenuItem>
        <MenuItem disabled onClick={() => onPick?.("delete")}>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

test("the trigger opens the popup, a row reports its command and closes it", async () => {
  const picked: string[] = [];
  await render(
    <HoronProvider scheme="light">
      <AccountMenu onPick={(row) => picked.push(row)} />
    </HoronProvider>,
  );
  const trigger = screen.getByRole("button", { name: "Account" });
  expect(trigger.props.accessibilityState).toMatchObject({ expanded: false });
  expect(screen.queryByText("Settings")).toBeNull();

  await fireEvent.press(trigger);
  expect(screen.getByRole("button", { name: "Account" }).props.accessibilityState).toMatchObject({ expanded: true });

  await fireEvent.press(screen.getByRole("button", { name: "Settings" }));
  expect(picked).toEqual(["settings"]);
  expect(screen.queryByText("Settings")).toBeNull();
});

test("a disabled row ignores presses and keeps the menu open", async () => {
  const picked: string[] = [];
  await render(
    <HoronProvider scheme="light">
      <AccountMenu onPick={(row) => picked.push(row)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Account" }));
  const row = screen.getByRole("button", { name: "Delete" });
  expect(row.props.accessibilityState).toMatchObject({ disabled: true });

  await fireEvent.press(row);
  expect(picked).toEqual([]);
  expect(screen.getByText("Delete")).toBeTruthy();
});

test("a controlled menu reports every request instead of opening itself", async () => {
  const seen: boolean[] = [];
  await render(
    <HoronProvider scheme="light">
      <Menu open={false} onOpenChange={(open) => seen.push(open)}>
        <MenuTrigger>Account</MenuTrigger>
        <MenuContent>
          <MenuItem>Settings</MenuItem>
        </MenuContent>
      </Menu>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Account" }));
  expect(seen).toEqual([true]);
  expect(screen.queryByText("Settings")).toBeNull();
});
