import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../../src/components/dialog";
import { HoronProvider } from "../../src/provider";

/** A controlled dialog around a plain trigger and one close action. */
function Harness({ onChange }: { onChange: (open: boolean) => void }) {
  return (
    <HoronProvider>
      <Dialog onOpenChange={onChange}>
        <DialogTrigger>
          <text>Delete bot</text>
        </DialogTrigger>
        <DialogContent title="Delete Inbox Manager?" description="Its routines are removed.">
          <DialogFooter>
            <DialogClose>
              <text>Cancel</text>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HoronProvider>
  );
}

test("tapping the trigger opens the dialog and tapping close closes it", async () => {
  const changes: boolean[] = [];
  const { findByText, queryByText } = render(<Harness onChange={(open) => changes.push(open)} />);

  await findByText("Delete bot");
  expect(queryByText("Delete Inbox Manager?")).toBeNull();

  fireEvent.tap(await findByText("Delete bot"));
  expect(await findByText("Delete Inbox Manager?")).toBeInTheDocument();
  expect(changes).toEqual([true]);

  fireEvent.tap(await findByText("Cancel"));
  expect(changes).toEqual([true, false]);
});

test("the close control takes the closeSlot value as its element id", async () => {
  const { findByText, container } = render(
    <HoronProvider>
      <Dialog defaultOpen>
        <DialogContent title="Delete workspace?" closeSlot="dialog-close" />
      </Dialog>
    </HoronProvider>,
  );

  await findByText("Delete workspace?");
  // React selected the control by `data-slot`; Lynx has no attribute selectors, so it is an id.
  expect(container.querySelector("#dialog-close")).not.toBeNull();
});

test("a closed dialog renders no overlay content at all", async () => {
  const { container, findByText } = render(<Harness onChange={() => undefined} />);

  await findByText("Delete bot");
  // The panel, the scrim and the description only exist while open.
  expect(container.textContent).toBe("Delete bot");
  expect(container.querySelector(".veil-overlay")).toBeNull();
  expect(container.querySelector(".bg-bg-scrim")).toBeNull();
});

test("a controlled dialog reports the request without moving itself", async () => {
  const changes: boolean[] = [];
  const { findByText, queryByText } = render(
    <HoronProvider>
      <Dialog open={false} onOpenChange={(open) => changes.push(open)}>
        <DialogTrigger>
          <text>Rename bot</text>
        </DialogTrigger>
        <DialogContent title="Rename workspace" />
      </Dialog>
    </HoronProvider>,
  );

  await findByText("Rename bot");
  fireEvent.tap(await findByText("Rename bot"));
  expect(changes).toEqual([true]);
  // The caller owns the state, so the panel stays closed.
  expect(queryByText("Rename workspace")).toBeNull();
});

test("a passed style reaches the dialog panel", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Dialog defaultOpen>
        <DialogContent title="Rename workspace" style={{ marginTop: "7px" }} />
      </Dialog>
    </HoronProvider>,
  );

  await findByText("Rename workspace");
  expect(container.querySelector(".motion-rise")).toHaveStyle({ marginTop: "7px" });
});
