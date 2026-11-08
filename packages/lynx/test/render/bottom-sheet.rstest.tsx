import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
} from "../../src/components/bottom-sheet";
import { HoronProvider } from "../../src/provider";

/** The settings sheet: a row and the action row that closes it. */
function Harness({ onChange }: { onChange: (open: boolean) => void }) {
  return (
    <HoronProvider>
      <BottomSheet onOpenChange={onChange}>
        <BottomSheetTrigger>
          <text>Open sheet</text>
        </BottomSheetTrigger>
        <BottomSheetContent title="Chief of staff">
          <BottomSheetRow value="On">Notifications</BottomSheetRow>
          <BottomSheetActions>
            <BottomSheetClose render={<BottomSheetAction />}>Cancel</BottomSheetClose>
            <BottomSheetAction variant="primary">Open chat</BottomSheetAction>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>
  );
}

test("tapping the trigger opens the sheet and Cancel closes it", async () => {
  const changes: boolean[] = [];
  const { findByText, queryByText } = render(<Harness onChange={(open) => changes.push(open)} />);

  await findByText("Open sheet");
  expect(queryByText("Chief of staff")).toBeNull();

  fireEvent.tap(await findByText("Open sheet"));
  expect(await findByText("Chief of staff")).toBeInTheDocument();
  expect(changes).toEqual([true]);

  fireEvent.tap(await findByText("Cancel"));
  expect(changes).toEqual([true, false]);
});

test("a closed sheet renders no title, row or scrim", async () => {
  const { container, findByText } = render(<Harness onChange={() => undefined} />);

  await findByText("Open sheet");
  expect(container.textContent).toBe("Open sheet");
  expect(container.querySelector(".bg-bg-scrim")).toBeNull();
});

test("a row without a tap handler is not a press target", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <BottomSheet defaultOpen>
        <BottomSheetContent title="Chief of staff">
          <BottomSheetRow value="On">Notifications</BottomSheetRow>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );

  await findByText("Notifications");
  const row = container.querySelector(".h-12");
  expect(row?.getAttribute("bindtap")).toBeNull();
});

test("a disabled action drops its tap handler", async () => {
  let taps = 0;
  const { container, findByText } = render(
    <HoronProvider>
      <BottomSheet defaultOpen>
        <BottomSheetContent title="Chief of staff">
          <BottomSheetActions>
            <BottomSheetAction disabled onClick={() => (taps += 1)}>
              Open chat
            </BottomSheetAction>
          </BottomSheetActions>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );

  await findByText("Open chat");
  const action = container.querySelector(".h-11");
  expect(action?.getAttribute("bindtap")).toBeNull();
  expect(taps).toBe(0);
});

test("a passed style reaches the sheet panel", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <BottomSheet defaultOpen>
        <BottomSheetContent title="Chief of staff" style={{ marginTop: "7px" }}>
          <BottomSheetRow value="On">Notifications</BottomSheetRow>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );

  await findByText("Chief of staff");
  expect(container.querySelector(".motion-rise")).toHaveStyle({ marginTop: "7px" });
});
