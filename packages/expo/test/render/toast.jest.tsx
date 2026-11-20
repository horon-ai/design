import { useEffect } from "react";
import { AccessibilityInfo } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { Toaster, useToast, type ToastManager } from "../../src/components/toast";
import { HoronPressable } from "../../src/lib/press";
import { HoronText } from "../../src/lib/text";
import { HoronProvider } from "../../src/provider";

/** The manager of the mounted viewport, captured in an effect so a test can read the queue it holds. */
const captured: { manager: ToastManager | null } = { manager: null };

/** A viewport with two controls: one raises a toast, the other drops the first queued one by id. */
function Harness({ timeout = 200, title }: { timeout?: number; title: string }) {
  const toast = useToast();
  useEffect(() => {
    captured.manager = toast;
  }, [toast]);
  return (
    <HoronProvider scheme="light">
      <Toaster>
        <HoronPressable
          role="button"
          onPress={() => toast.add({ title, description: "All changes stored.", timeout })}
        >
          <HoronText>Save</HoronText>
        </HoronPressable>
        <HoronPressable
          role="button"
          accessibilityLabel="Drop first"
          onPress={() => {
            const first = toast.toasts[0];
            if (first) toast.close(first.id);
          }}
        >
          <HoronText>Drop</HoronText>
        </HoronPressable>
      </Toaster>
    </HoronProvider>
  );
}

test("adding a toast shows both lines, announces them and closes on its close control", async () => {
  const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
  await render(<Harness title="Saved" timeout={0} />);
  expect(screen.queryByText("Saved")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.getByText("Saved")).toBeTruthy();
  expect(screen.getByText("All changes stored.")).toBeTruthy();
  expect(announce).toHaveBeenCalledWith("Saved. All changes stored.");

  await fireEvent.press(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByText("Saved")).toBeNull();
  announce.mockRestore();
});

test("a toast with a timeout drops itself", async () => {
  await render(<Harness title="Short lived" timeout={50} />);
  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.getByText("Short lived")).toBeTruthy();
  await waitFor(() => expect(screen.queryByText("Short lived")).toBeNull());
});

test("dropping the first queued toast by id clears it from the viewport", async () => {
  await render(<Harness title="Queued" timeout={0} />);
  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.getByText("Queued")).toBeTruthy();
  expect(captured.manager?.toasts).toHaveLength(1);

  await fireEvent.press(screen.getByRole("button", { name: "Drop first" }));
  await waitFor(() => expect(screen.queryByText("Queued")).toBeNull());
  expect(captured.manager?.toasts).toHaveLength(0);
});
