import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Modal, ModalClose, ModalContent, ModalFooter, ModalTrigger } from "../../src/components/modal";
import { HoronProvider } from "../../src/provider";

/** A modal wired the way a settings screen saves a longer form. */
function WorkspaceModal({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Modal onOpenChange={onOpenChange}>
      <ModalTrigger>Edit workspace</ModalTrigger>
      <ModalContent
        title="Rename workspace"
        footer={
          <ModalFooter>
            <ModalClose>Save</ModalClose>
          </ModalFooter>
        }
      >
        <></>
      </ModalContent>
    </Modal>
  );
}

test("the trigger opens the modal and a footer close control dismisses it", async () => {
  await render(
    <HoronProvider scheme="light">
      <WorkspaceModal />
    </HoronProvider>,
  );
  expect(screen.queryByText("Rename workspace")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Edit workspace" }));
  expect(screen.getByText("Rename workspace")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.queryByText("Rename workspace")).toBeNull();
});

test("a controlled modal reports the request and stays closed", async () => {
  const seen: boolean[] = [];
  await render(
    <HoronProvider scheme="light">
      <Modal open={false} onOpenChange={(open) => seen.push(open)}>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent title="Pinned">{null}</ModalContent>
      </Modal>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Open" }));
  expect(seen).toEqual([true]);
  expect(screen.queryByText("Pinned")).toBeNull();
});
