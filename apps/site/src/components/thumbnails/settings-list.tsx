import { SettingsKey, SettingsKeys, SettingsList, SettingsRow, SettingsRowIcon, SettingsSwitch } from "@horon-ai/react";
import { ArrowClockwise } from "@phosphor-icons/react";

export default function SettingsListThumbnail() {
  return (
    <SettingsList className="w-[310px]">
      <SettingsRow
        leading={
          <SettingsRowIcon>
            <ArrowClockwise />
          </SettingsRowIcon>
        }
        title="Keep working"
        description="Runs on other devices."
        control={<SettingsSwitch defaultChecked aria-label="Keep working" />}
      />
      <SettingsRow
        title="Share usage"
        control={<SettingsSwitch aria-label="Share usage" />}
      />
      <SettingsRow
        title="Quick command"
        control={
          <SettingsKeys>
            <SettingsKey>⌘</SettingsKey>
            <SettingsKey>K</SettingsKey>
          </SettingsKeys>
        }
      />
    </SettingsList>
  );
}
