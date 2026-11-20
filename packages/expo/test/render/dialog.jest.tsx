import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../../src/components/dialog";
import { HoronProvider } from "../../src/provider";

/** A dialog wired the way a settings screen renames an item. */
function RenameDialog({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>Rename</DialogTrigger>
      <DialogContent title="Rename bot" description="Every mention updates.">
        <DialogClose>Save</DialogClose>
      </DialogContent>
    </Dialog>
  );
}

test("the trigger opens the dialog and a close control closes it", async () => {
  await render(
    <HoronProvider scheme="light">
      <RenameDialog />
    </HoronProvider>,
  );
  expect(screen.queryByText("Rename bot")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Rename" }));
  expect(screen.getByText("Rename bot")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.queryByText("Rename bot")).toBeNull();
});

test("the close control dismisses an open dialog and reports both changes", async () => {
  const seen: boolean[] = [];
  await render(
    <HoronProvider scheme="light">
      <RenameDialog onOpenChange={(open) => seen.push(open)} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Rename" }));
  await fireEvent.press(screen.getByRole("button", { name: "Close" }));

  expect(seen).toEqual([true, false]);
  expect(screen.queryByText("Rename bot")).toBeNull();
});

test("a controlled dialog follows its open prop and never opens itself", async () => {
  const seen: boolean[] = [];
  await render(
    <HoronProvider scheme="light">
      <Dialog open={false} onOpenChange={(open) => seen.push(open)}>
        <DialogTrigger>Rename</DialogTrigger>
        <DialogContent title="Rename bot">
          <DialogClose>Save</DialogClose>
        </DialogContent>
      </Dialog>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Rename" }));
  expect(seen).toEqual([true]);
  expect(screen.queryByText("Rename bot")).toBeNull();
});
