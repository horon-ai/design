import { SettingsList, SettingsRow, SettingsSwitch } from "@horon-ai/react";

export default function SettingsListSwitches() {
  return (
    <SettingsList className="w-full max-w-120">
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
      <SettingsRow
        title="Share usage with the team"
        control={<SettingsSwitch aria-label="Share usage" />}
      />
      <SettingsRow
        title="Managed by your workspace"
        description="Your admin controls this option."
        control={<SettingsSwitch disabled aria-label="Managed by your workspace" />}
      />
    </SettingsList>
  );
}
