import { SettingsKey, SettingsKeys, SettingsList, SettingsRow, SettingsSwitch } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function SettingsListDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop>
        <SettingsList surface="glass" className="w-full max-w-120">
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
            title="Quick command"
            description="Open the command palette from anywhere."
            control={
              <SettingsKeys>
                <SettingsKey>⌘</SettingsKey>
                <SettingsKey>K</SettingsKey>
              </SettingsKeys>
            }
          />
          <SettingsRow
            title="Disabled option"
            description="Managed by your workspace admin."
            control={<SettingsSwitch disabled aria-label="Disabled" />}
          />
        </SettingsList>
      </Backdrop>
      <div className="w-full max-w-120 rounded-2xl bg-bg-default p-4">
        <SettingsList>
          <SettingsRow
            title="Keep working after I close the laptop"
            description="Runs continue on your other devices."
            control={<SettingsSwitch defaultChecked aria-label="Keep working" />}
          />
          <SettingsRow title="Share usage with the team" control={<SettingsSwitch aria-label="Share usage" />} />
        </SettingsList>
      </div>
    </div>
  );
}
