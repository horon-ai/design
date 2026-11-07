import { formatShortcut } from "../../src/lib/platform";
import { usePlatform } from "../../src/hooks/use-platform";
import { Radio, RadioGroup } from "../../src/components/radio-group";
import { SettingsKey, SettingsKeys, SettingsList, SettingsRow, SettingsSwitch } from "../../src/components/settings-list";
import { Backdrop } from "./backdrop";

/** The same five rows for both surfaces: three toggles, a shortcut chord, a picker and a locked row. */
function Rows({ surface }: { surface: "solid" | "glass" }) {
  const { os } = usePlatform();
  return (
    <SettingsList surface={surface} className="w-full max-w-[480px]">
      <SettingsRow
        title="Keep working after I close the laptop"
        description="Runs continue on your other devices."
        control={<SettingsSwitch defaultChecked aria-label="Keep working" />}
      />
      <SettingsRow
        title="Ask before sending email"
        description="Drafts wait for your approval."
        control={<SettingsSwitch defaultChecked aria-label="Ask before sending" />}
      />
      <SettingsRow title="Share usage with the team" control={<SettingsSwitch aria-label="Share usage" />} />
      <SettingsRow
        title="Digest cadence"
        description="How often the bot reports back."
        control={
          <RadioGroup size="sm" defaultValue="daily" aria-label="Digest cadence">
            <Radio value="hourly" label="Hourly" />
            <Radio value="daily" label="Daily" />
          </RadioGroup>
        }
      />
      <SettingsRow
        title="Quick command"
        description="Open the command palette from anywhere."
        control={
          <SettingsKeys>
            <SettingsKey>{formatShortcut("Mod", os)}</SettingsKey>
            <SettingsKey>K</SettingsKey>
          </SettingsKeys>
        }
      />
      <SettingsRow
        title="Disabled option"
        description="Managed by your workspace admin."
        control={<SettingsSwitch disabled aria-label="Disabled" />}
        className="border-b-0"
      />
    </SettingsList>
  );
}

/** Solid and glass settings cards; switches, a radio pair, a keycap chord and a disabled row. */
export default function SettingsListDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Rows surface="solid" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop>
          <Rows surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
