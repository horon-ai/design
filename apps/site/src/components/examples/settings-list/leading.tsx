import { SettingsList, SettingsRow, SettingsRowIcon, SettingsSwitch } from "@horon-ai/react";
import { Bell, EnvelopeSimple, Gear } from "@phosphor-icons/react";

export default function SettingsListLeading() {
  return (
    <SettingsList className="w-full max-w-120">
      <SettingsRow
        leading={
          <SettingsRowIcon>
            <Bell />
          </SettingsRowIcon>
        }
        title="Notifications"
        description="Pings when a run finishes."
        control={<SettingsSwitch defaultChecked aria-label="Notifications" />}
      />
      <SettingsRow
        leading={
          <SettingsRowIcon>
            <EnvelopeSimple />
          </SettingsRowIcon>
        }
        title="Email digest"
        description="One summary every Monday."
        control={<SettingsSwitch aria-label="Email digest" />}
      />
      <SettingsRow
        leading={
          <SettingsRowIcon>
            <Gear />
          </SettingsRowIcon>
        }
        title="Advanced"
        description="Model routing and tool permissions."
      />
    </SettingsList>
  );
}
