import { useState } from "react";
import { DeviceEventEmitter, Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaInsetsContext, type EdgeInsets } from "react-native-safe-area-context";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { afterEach, expect, jest, test } from "@jest/globals";

import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
} from "../../src/components/bottom-sheet";
import { Button } from "../../src/components/button";
import { HoronProvider } from "../../src/provider";

const HOME_INDICATOR: EdgeInsets = { top: 59, right: 0, bottom: 34, left: 0 };
const LANDSCAPE_INSETS: EdgeInsets = { top: 0, right: 44, bottom: 21, left: 44 };
const ZERO_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

type HostNode = ReturnType<typeof screen.getByRole>;

afterEach(() => {
  jest.restoreAllMocks();
});

/** Pins the reported window dimensions for narrow-phone vs tablet/wide-web layout tests. */
function setWindowSize(width: number, height: number) {
  jest.spyOn(Dimensions, "get").mockReturnValue({ width, height, scale: 2, fontScale: 1 });
}

/** Walks a rendered host subtree to find the first node matching `predicate`. */
function findNode(root: HostNode | null, predicate: (node: HostNode) => boolean): HostNode | null {
  if (!root) return null;
  if (predicate(root)) return root;
  for (const child of root.children) {
    if (typeof child !== "string") {
      const found = findNode(child, predicate);
      if (found) return found;
    }
  }
  return null;
}

/** Walks up the host ancestor chain to find the first node matching `predicate`. */
function findAncestor(node: HostNode, predicate: (node: HostNode) => boolean): HostNode | null {
  let current = node.parent;
  while (current) {
    if (predicate(current)) return current;
    current = current.parent;
  }
  return null;
}

/** Flattened style of the sheet dialog frame. */
function dialogStyle() {
  return StyleSheet.flatten(screen.getByLabelText("Reminder").props.style);
}

/** Flattened `contentContainerStyle` of the sheet's scrollable body. */
function scrollContentStyle() {
  const dialog = screen.getByLabelText("Reminder");
  const scroll = findNode(
    dialog,
    (node) => node.type === "RCTScrollView" || node.props.contentContainerStyle !== undefined,
  );
  const content = scroll?.props.contentContainerStyle
    ? scroll.props.contentContainerStyle
    : findNode(scroll, (node) => node.type === "RCTScrollContentView")?.props.style;
  return StyleSheet.flatten(content);
}

/** A sheet whose action row saves a reminder, counting the saves it sees. */
function ReminderSheet() {
  const [saved, setSaved] = useState(0);
  return (
    <BottomSheet>
      <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
      <BottomSheetContent title="Reminder">
        <BottomSheetActions>
          <BottomSheetAction variant="primary" onPress={() => setSaved((value) => value + 1)}>
            Save
          </BottomSheetAction>
        </BottomSheetActions>
        <Text>saved {saved}</Text>
      </BottomSheetContent>
    </BottomSheet>
  );
}

const renderOpenSheet = (
  insets: EdgeInsets,
  props: Partial<Parameters<typeof BottomSheetContent>[0]> = {},
) => (
  <SafeAreaInsetsContext.Provider value={insets}>
    <HoronProvider scheme="light">
      <BottomSheet defaultOpen>
        <BottomSheetContent title="Reminder" {...props}>
          <Text>Body copy</Text>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>
  </SafeAreaInsetsContext.Provider>
);

test("the trigger opens the sheet and its action row fires the action's own handler", async () => {
  await render(
    <HoronProvider scheme="light">
      <ReminderSheet />
    </HoronProvider>,
  );
  expect(screen.queryByText("Reminder")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Open sheet" }));
  expect(screen.getByText("Reminder")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Save" }));
  expect(screen.getByText("saved 1")).toBeTruthy();
});

test("a trigger rendered through `render` keeps the caller's children as its label", async () => {
  await render(
    <HoronProvider scheme="light">
      <BottomSheet>
        <BottomSheetTrigger render={<Button variant="solid" />}>Open the sheet</BottomSheetTrigger>
        <BottomSheetContent title="Reminder" />
      </BottomSheet>
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Open the sheet" }));
  expect(screen.getByText("Reminder")).toBeTruthy();
});

test("a disabled settings row ignores presses and announces itself as disabled", async () => {
  let presses = 0;
  await render(
    <HoronProvider scheme="light">
      <BottomSheet defaultOpen>
        <BottomSheetContent title="Settings">
          <BottomSheetRow disabled value="Off" onPress={() => (presses += 1)}>
            Notifications
          </BottomSheetRow>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );
  const row = screen.getByRole("button", { name: /Notifications/ });
  expect(row.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(row);
  expect(presses).toBe(0);
});

test.each(["solid", "glass"] as const)(
  "on a narrow phone screen, a %s sheet docks flush to left, right and bottom edges (bottom 0) with rounded top corners only",
  async (surface) => {
    setWindowSize(390, 844);
    await render(renderOpenSheet(HOME_INDICATOR, { surface }));

    const dialog = screen.getByLabelText("Reminder");
    const frameStyle = StyleSheet.flatten(dialog.props.style);
    const viewportStyle = StyleSheet.flatten(dialog.parent?.props.style);
    const hostStyle = StyleSheet.flatten(dialog.parent?.parent?.props.style);

    // Host pins to container bottom 0 and docks the sheet flush with zero outer bottom/side margin or padding.
    expect(hostStyle?.position).toBe("absolute");
    expect(hostStyle?.bottom).toBe(0);
    expect(hostStyle?.left).toBe(0);
    expect(hostStyle?.right).toBe(0);
    expect(hostStyle?.justifyContent).toBe("flex-end");
    expect(hostStyle?.marginBottom).toBe(0);
    expect(hostStyle?.paddingBottom).toBe(0);

    expect(viewportStyle?.width).toBe("100%");
    expect(viewportStyle?.alignItems).toBe("center");
    expect(viewportStyle?.paddingHorizontal ?? 0).toBe(0);
    expect(viewportStyle?.marginBottom).toBe(0);
    expect(viewportStyle?.paddingBottom).toBe(0);

    expect(frameStyle?.width).toBe("100%");
    expect(frameStyle?.alignSelf).toBe("center");
    expect(frameStyle?.maxWidth).toBe(560);
    expect(frameStyle?.marginBottom).toBe(0);
    expect(frameStyle?.paddingBottom).toBe(0);

    // Top corners rounded; bottom corners square so the surface meets the screen edge cleanly.
    expect(frameStyle?.borderTopLeftRadius).toBe(20);
    expect(frameStyle?.borderTopRightRadius).toBe(20);
    expect(frameStyle?.borderBottomLeftRadius).toBe(0);
    expect(frameStyle?.borderBottomRightRadius).toBe(0);

    if (surface === "glass") {
      // GlassSurface must not emit a `borderRadius` shorthand that overrides square bottom corners on web.
      const glassLayer = dialog.children.find(
        (child): child is HostNode => typeof child !== "string" && child.props.pointerEvents === "none",
      );
      const glassStyle = StyleSheet.flatten(glassLayer?.props.style);
      expect(glassStyle?.borderRadius).toBeUndefined();
      expect(glassStyle?.borderTopLeftRadius).toBe(20);
      expect(glassStyle?.borderTopRightRadius).toBe(20);
      expect(glassStyle?.borderBottomLeftRadius).toBe(0);
      expect(glassStyle?.borderBottomRightRadius).toBe(0);
    }

    // Safe area bottom inset is applied only inside the scrollable content container, never outside the sheet.
    expect(scrollContentStyle()?.paddingBottom).toBe(surface === "glass" ? 54 : 58);
  },
);

test("on a wide screen, the sheet centres at maxWidth while docked to the bottom, and maxWidth=\"none\" removes the cap", async () => {
  setWindowSize(1280, 900);
  const { rerender } = await render(renderOpenSheet(LANDSCAPE_INSETS, { surface: "solid" }));

  // Default 560pt cap centred horizontally; 360pt side gap clears the 44pt landscape inset, while bottom safe area stays.
  expect(dialogStyle()?.width).toBe("100%");
  expect(dialogStyle()?.alignSelf).toBe("center");
  expect(dialogStyle()?.maxWidth).toBe(560);
  expect(dialogStyle()?.marginBottom).toBe(0);
  expect(dialogStyle()?.paddingBottom).toBe(0);
  expect(dialogStyle()?.borderBottomLeftRadius).toBe(0);
  expect(dialogStyle()?.borderBottomRightRadius).toBe(0);
  expect(scrollContentStyle()?.paddingLeft).toBe(16);
  expect(scrollContentStyle()?.paddingRight).toBe(16);
  expect(scrollContentStyle()?.paddingBottom).toBe(45);

  await rerender(renderOpenSheet(LANDSCAPE_INSETS, { surface: "solid", maxWidth: 640 }));
  expect(dialogStyle()?.maxWidth).toBe(640);
  expect(dialogStyle()?.alignSelf).toBe("center");

  // Uncapping with maxWidth="none" spans full width and restores horizontal safe-area insets.
  await rerender(renderOpenSheet(LANDSCAPE_INSETS, { surface: "solid", maxWidth: "none" }));
  expect(dialogStyle()?.maxWidth).toBeUndefined();
  expect(scrollContentStyle()?.paddingLeft).toBe(60);
  expect(scrollContentStyle()?.paddingRight).toBe(60);
  expect(scrollContentStyle()?.paddingBottom).toBe(45);
});

test("bottom content padding tracks changing safe-area insets (zero on web/non-notch, inset on home-indicator devices)", async () => {
  setWindowSize(390, 844);
  const { rerender } = await render(renderOpenSheet(ZERO_INSETS, { surface: "solid" }));

  expect(scrollContentStyle()?.paddingBottom).toBe(24);
  expect(scrollContentStyle()?.paddingLeft).toBe(16);
  expect(scrollContentStyle()?.paddingRight).toBe(16);

  await rerender(renderOpenSheet(HOME_INDICATOR, { surface: "solid" }));
  expect(scrollContentStyle()?.paddingBottom).toBe(58);
});

test("opening the keyboard keeps the sheet anchored to bottom 0 and clears the keyboard without double safe-area padding", async () => {
  setWindowSize(402, 874);
  await render(renderOpenSheet(HOME_INDICATOR, { surface: "solid" }));
  const dialog = screen.getByLabelText("Reminder");
  const host = dialog.parent?.parent;
  const hostStyle = () => StyleSheet.flatten(host?.props.style);

  expect(hostStyle()?.bottom).toBe(0);
  expect(hostStyle()?.paddingBottom).toBe(0);
  expect(scrollContentStyle()?.paddingBottom).toBe(58);

  await act(async () => {
    DeviceEventEmitter.emit("keyboardWillShow", {
      endCoordinates: { height: 336, screenY: 538, width: 402, screenX: 0 },
      startCoordinates: { height: 0, screenY: 874, width: 402, screenX: 0 },
      duration: 250,
      easing: "keyboard",
    });
  });

  // Sheet stays anchored to bottom 0; content clears 336pt keyboard + 24pt base (360pt, NOT 360 + 34 double padding).
  expect(hostStyle()?.bottom).toBe(0);
  expect(hostStyle()?.paddingBottom).toBe(0);
  expect(scrollContentStyle()?.paddingBottom).toBe(360);

  await act(async () => {
    DeviceEventEmitter.emit("keyboardWillHide", {
      endCoordinates: { height: 0, screenY: 874, width: 402, screenX: 0 },
      startCoordinates: { height: 336, screenY: 538, width: 402, screenX: 0 },
      duration: 250,
      easing: "keyboard",
    });
  });

  expect(hostStyle()?.bottom).toBe(0);
  expect(hostStyle()?.paddingBottom).toBe(0);
  expect(scrollContentStyle()?.paddingBottom).toBe(58);
});

test("hardware back and accessibility escape close the sheet even when backdrop is false", async () => {
  let openState = true;
  const { rerender } = await render(
    <HoronProvider scheme="light">
      <BottomSheet open={openState} onOpenChange={(next) => (openState = next)}>
        <BottomSheetContent title="Reminder" backdrop={false}>
          <Text>Body</Text>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );

  const dialog = screen.getByLabelText("Reminder");
  const modal = findAncestor(dialog, (node) => typeof node.props.onRequestClose === "function");
  expect(modal).not.toBeNull();
  if (!modal) return;

  await fireEvent(modal, "requestClose");
  expect(openState).toBe(false);

  openState = true;
  await rerender(
    <HoronProvider scheme="light">
      <BottomSheet open={openState} onOpenChange={(next) => (openState = next)}>
        <BottomSheetContent title="Reminder" backdrop={false}>
          <Text>Body</Text>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );

  const host = screen.getByLabelText("Reminder").parent?.parent;
  expect(host).not.toBeNull();
  if (!host) return;
  await fireEvent(host, "accessibilityEscape");
  expect(openState).toBe(false);
});

test("a detail sheet renders a custom View header directly without nesting it inside Text", async () => {
  await render(
    <HoronProvider scheme="light">
      <BottomSheet defaultOpen>
        <BottomSheetContent
          variant="detail"
          title={
            <View>
              <Text>Weekly digest</Text>
              <Text>Every Monday at 8:00</Text>
            </View>
          }
        >
          <Text>Summary body</Text>
        </BottomSheetContent>
      </BottomSheet>
    </HoronProvider>,
  );

  expect(screen.getByText("Weekly digest")).toBeTruthy();
  expect(screen.getByText("Every Monday at 8:00")).toBeTruthy();
  expect(screen.getByText("Summary body")).toBeTruthy();
});
