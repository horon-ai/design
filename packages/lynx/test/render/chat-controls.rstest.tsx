import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { JumpToLatest, NewMessagesPill, VoiceInput } from "../../src/components/chat-controls";
import { HoronProvider } from "../../src/provider";

const byLabel = (container: HTMLElement, label: string): Element => {
  const found = container.querySelector(`[accessibility-label='${label}']`);
  if (!found) throw new Error(`no control labelled ${label}`);
  return found;
};

test("the jump button forwards its tap and keeps the default accessible name", () => {
  const onClick = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <JumpToLatest onClick={onClick} />
    </HoronProvider>,
  );

  const button = byLabel(container, "Jump to latest");
  fireEvent.tap(button);
  expect(onClick).toHaveBeenCalledTimes(1);

  // The circle is a 44px square view, as the Figma frame draws it.
  expect(button.className).toContain("size-11");
  expect(button.getAttribute("accessibility-traits")).toBe("button");
});

test("the new-messages pill renders its label and reports the tap", () => {
  const onClick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <NewMessagesPill onClick={onClick}>3 new messages</NewMessagesPill>
    </HoronProvider>,
  );

  expect(getByText("3 new messages")).toBeInTheDocument();
  // The pill itself is the button, so the tap lands on the 40px control.
  fireEvent.tap(container.querySelector("[accessibility-traits='button']")!);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("the voice pill's stop button fires and the timer is shown", () => {
  const onStop = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <VoiceInput elapsed="0:07" onStop={onStop} />
    </HoronProvider>,
  );

  expect(getByText("0:07")).toBeInTheDocument();

  // 18 Figma bars, each with its height written inline.
  const bars = container.querySelectorAll(".bg-interactive-primary-75");
  expect(bars.length).toBe(18);
  expect(bars[0]?.getAttribute("style")).toContain("height: 8px");

  fireEvent.tap(byLabel(container, "Stop recording"));
  expect(onStop).toHaveBeenCalledTimes(1);
});

test("custom levels scale to 4–28px, and a stopped recording ships no animation", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <VoiceInput elapsed="0:12" levels={[0, 0.5, 1]} recording={false} />
    </HoronProvider>,
  );

  const bars = container.querySelectorAll(".bg-interactive-primary-75");
  expect(bars.length).toBe(3);
  expect(bars[0]?.getAttribute("style")).toContain("height: 4px");
  expect(bars[1]?.getAttribute("style")).toContain("height: 14px");
  expect(bars[2]?.getAttribute("style")).toContain("height: 28px");
  // recording=false drops the wave animation entirely.
  expect(bars[0]?.getAttribute("style") ?? "").not.toContain("wave-level");
});

test("a glass control paints its liquid layer, a solid one does not", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <JumpToLatest surface="glass" />
        <NewMessagesPill>Unread</NewMessagesPill>
      </view>
    </HoronProvider>,
  );

  expect(container.querySelectorAll(".liquid-layers").length).toBe(1);
  expect(container.querySelector(".bg-glass-clear")).not.toBeNull();
});
