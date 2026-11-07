import {
  formatShortcut,
  SettingsKey,
  SettingsKeys,
  SettingsList,
  SettingsRow,
  SettingsSwitch,
  usePlatform,
} from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function SettingsListGlass() {
  const { os } = usePlatform();
  return (
    <Backdrop>
      <SettingsList surface="glass" className="w-full max-w-120">
        <SettingsRow
          title="Keep working after I close the laptop"
          description="Runs continue on your other devices."
          control={<SettingsSwitch defaultChecked aria-label="Keep working" />}
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
      </SettingsList>
    </Backdrop>
  );
}
