import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Modal, ModalClose, ModalContent, ModalFooter, ModalTrigger } from "../../src/components/modal";
import { HoronProvider } from "../../src/provider";

/** A modal with a header, a body and the footer that closes it. */
function Harness({ onChange }: { onChange: (open: boolean) => void }) {
  return (
    <HoronProvider>
      <Modal onOpenChange={onChange}>
        <ModalTrigger>
          <text>Edit bot</text>
        </ModalTrigger>
        <ModalContent
          title="Edit Inbox Manager"
          description="Changes apply from the next run."
          footer={
            <ModalFooter>
              <ModalClose>
                <text>Save changes</text>
              </ModalClose>
            </ModalFooter>
          }
        >
          <text>Body</text>
        </ModalContent>
      </Modal>
    </HoronProvider>
  );
}

test("tapping the trigger opens the modal and the footer close closes it", async () => {
  const changes: boolean[] = [];
  const { findByText, queryByText } = render(<Harness onChange={(open) => changes.push(open)} />);

  await findByText("Edit bot");
  expect(queryByText("Edit Inbox Manager")).toBeNull();

  fireEvent.tap(await findByText("Edit bot"));
  expect(await findByText("Edit Inbox Manager")).toBeInTheDocument();
  expect(changes).toEqual([true]);

  fireEvent.tap(await findByText("Save changes"));
  expect(changes).toEqual([true, false]);
});

test("a closed modal renders no header, body or scrim", async () => {
  const { container, findByText } = render(<Harness onChange={() => undefined} />);

  await findByText("Edit bot");
  expect(container.textContent).toBe("Edit bot");
  expect(container.querySelector(".bg-bg-scrim")).toBeNull();
});

test("the glass surface paints the veil, the solid one the surface fill", async () => {
  const { container, findByText, rerender } = render(
    <HoronProvider>
      <Modal defaultOpen>
        <ModalContent title="Rename workspace" surface="glass" />
      </Modal>
    </HoronProvider>,
  );

  await findByText("Rename workspace");
  expect(container.querySelector(".veil-overlay")).not.toBeNull();

  rerender(
    <HoronProvider>
      <Modal defaultOpen>
        <ModalContent title="Rename workspace" surface="solid" />
      </Modal>
    </HoronProvider>,
  );
  expect(container.querySelector(".veil-overlay")).toBeNull();
  expect(container.querySelector(".bg-bg-surface")).not.toBeNull();
});

test("a passed style reaches the modal panel", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Modal defaultOpen>
        <ModalContent title="Rename workspace" style={{ marginTop: "7px" }} />
      </Modal>
    </HoronProvider>,
  );

  await findByText("Rename workspace");
  expect(container.querySelector(".motion-rise")).toHaveStyle({ marginTop: "7px" });
});
