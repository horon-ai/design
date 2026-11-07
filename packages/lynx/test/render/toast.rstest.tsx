import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Toaster, useToast } from "../../src/components/toast";
import { HoronProvider } from "../../src/provider";

/** A trigger inside a `Toaster`, the way an app wires a save action. */
function Harness({ type }: { type?: string }) {
  return (
    <HoronProvider>
      <Toaster>
        <SaveButton type={type} />
      </Toaster>
    </HoronProvider>
  );
}

function SaveButton({ type }: { type?: string }) {
  const toast = useToast();
  return (
    <view bindtap={() => toast.add({ title: "Saved", description: "All changes stored.", type })}>
      <text>Save</text>
    </view>
  );
}

/**
 * The queue is module state (there is no provider to own it on Lynx), so the
 * cases run in file order and each one leaves the queue empty for the next.
 */
test("nothing is painted before the first toast is added", async () => {
  const { container, findByText } = render(<Harness />);

  await findByText("Save");
  // Only the trigger is in the tree: the fixed viewport holds no card.
  expect(container.textContent).toBe("Save");
  expect(container.querySelector(".shadow-popover")).toBeNull();
});

test("toast() shows a message after the trigger is tapped", async () => {
  const { findByText, queryByText } = render(<Harness />);

  await findByText("Save");
  expect(queryByText("Saved")).toBeNull();

  fireEvent.tap(await findByText("Save"));
  expect(await findByText("Saved")).toBeInTheDocument();
  expect(await findByText("All changes stored.")).toBeInTheDocument();
});

test("the close control removes the toast from the queue", async () => {
  const { container, findAllByText, findByText, queryByText } = render(<Harness type="success" />);

  fireEvent.tap(await findByText("Save"));
  expect((await findAllByText("Saved")).length).toBeGreaterThan(0);

  // Dismiss every card the queue holds, including the one the previous case left.
  // Lynx exposes the accessible name as `accessibility-label`, which jsdom keeps
  // as a plain attribute instead of mapping it to `aria-label`.
  for (const close of container.querySelectorAll('[accessibility-label="Close"]')) fireEvent.tap(close);
  expect(queryByText("Saved")).toBeNull();
});
