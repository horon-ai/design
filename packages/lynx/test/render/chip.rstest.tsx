import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Chip } from "../../src/components/chip";
import { HoronProvider } from "../../src/provider";

/** A chip that owns its state and prints it, so the tap result is observable. */
function Toggling() {
  const [pressed, setPressed] = useState(false);
  return (
    <view>
      <Chip defaultPressed={false} onPressedChange={setPressed}>
        Documents
      </Chip>
      <text>state {pressed ? "pressed" : "idle"}</text>
    </view>
  );
}

test("tapping a Chip flips its pressed state and reports it", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Toggling />
    </HoronProvider>,
  );

  const chip = container.querySelector('[accessibility-role-description="checkbox"]')!;
  expect(chip.getAttribute("accessibility-value")).toBe("not pressed");
  expect(container.textContent).toContain("state idle");

  fireEvent.tap(chip);
  expect(chip.getAttribute("accessibility-value")).toBe("pressed");
  expect(container.textContent).toContain("state pressed");

  fireEvent.tap(chip);
  expect(chip.getAttribute("accessibility-value")).toBe("not pressed");
  expect(container.textContent).toContain("state idle");
});

test("a controlled Chip follows the caller's pressed prop, not its own state", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <Chip pressed>Settled</Chip>
        <Chip pressed={false}>Open</Chip>
      </view>
    </HoronProvider>,
  );

  const [settled, open] = container.querySelectorAll('[accessibility-role-description="checkbox"]');
  expect(settled.getAttribute("accessibility-value")).toBe("pressed");
  expect(settled.className).toContain("border-border-brand");
  expect(open.getAttribute("accessibility-value")).toBe("not pressed");
  expect(open.className).toContain("border-border-default");
});

test("a disabled Chip refuses the tap and shows the closed check slot", () => {
  let calls = 0;
  const { container } = render(
    <HoronProvider scheme="light">
      <Chip disabled onPressedChange={() => (calls += 1)}>
        Archive
      </Chip>
    </HoronProvider>,
  );

  const chip = container.querySelector('[accessibility-role-description="checkbox"]')!;
  expect(chip.getAttribute("accessibility-traits")).toBe("disabled");
  expect(chip.getAttribute("accessibility-value")).toBe("not pressed");
  expect(chip.className).toContain("opacity-40");

  fireEvent.tap(chip);
  expect(calls).toBe(0);
  expect(chip.getAttribute("accessibility-value")).toBe("not pressed");
});
