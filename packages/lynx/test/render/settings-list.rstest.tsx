import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import {
  SettingsKey,
  SettingsKeys,
  SettingsList,
  SettingsRow,
  SettingsSwitch,
} from "../../src/components/settings-list";
import { HoronProvider } from "../../src/provider";

/** A labelled switch is the row's whole control, so the test taps that control and reads its announced state. */
const switches = (container: HTMLElement): Element[] => [
  ...container.querySelectorAll("[accessibility-role-description='switch']"),
];

test("tapping a row's switch reports the next state and moves the thumb", async () => {
  const seen: boolean[] = [];
  const { container } = render(
    <HoronProvider>
      <SettingsList>
        <SettingsRow
          title="Sync on Wi-Fi"
          description="Only use Wi-Fi for uploads"
          control={<SettingsSwitch aria-label="Sync on Wi-Fi" onCheckedChange={(next) => seen.push(next)} />}
        />
      </SettingsList>
    </HoronProvider>,
  );

  fireEvent.tap(switches(container)[0]);
  await Promise.resolve();

  expect(seen).toEqual([true]);
  expect(switches(container)[0].getAttribute("accessibility-value")).toBe("checked");
});

test("a disabled row control ignores the tap and a keycap row reports no change", async () => {
  const seen: boolean[] = [];
  const { container, findByText } = render(
    <HoronProvider>
      <SettingsList>
        <SettingsRow
          title="Quick command"
          control={
            <SettingsKeys>
              <SettingsKey>⌘</SettingsKey>
              <SettingsKey>K</SettingsKey>
            </SettingsKeys>
          }
        />
        <SettingsRow
          title="Managed by admin"
          control={<SettingsSwitch disabled aria-label="Managed" onCheckedChange={(next) => seen.push(next)} />}
          className="border-b-0"
        />
      </SettingsList>
    </HoronProvider>,
  );

  await findByText("Quick command");
  fireEvent.tap(switches(container)[0]);
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(switches(container)[0].getAttribute("accessibility-value")).toBe("unchecked");
  // The keycap chord renders as plain text, not as a second control.
  expect(switches(container)).toHaveLength(1);
});

test("SettingsSwitch is pre-wired at the md rung and a glass list paints its liquid layer", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <SettingsList surface="glass">
        <SettingsRow title="Share usage" control={<SettingsSwitch aria-label="Share usage" />} />
      </SettingsList>
    </HoronProvider>,
  );

  await findByText("Share usage");
  const track = switches(container)[0];
  expect(track.getAttribute("class")).toContain("h-[26px]");
  expect(track.getAttribute("class")).toContain("w-[44px]");
  expect(container.querySelector(".liquid-layers")).not.toBeNull();
});
