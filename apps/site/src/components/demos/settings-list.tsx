import {
  formatShortcut,
  SettingsKey,
  SettingsKeys,
  SettingsList,
  SettingsRow,
  SettingsSwitch,
  usePlatform,
} from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Rows({ surface }: { surface: "solid" | "glass" }) {
  const { os } = usePlatform();
  return (
    <SettingsList surface={surface} className="w-full max-w-120">
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
            <SettingsKey>{formatShortcut("Mod", os)}</SettingsKey>
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
  );
}

export default function SettingsListDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full justify-center">
          <Rows surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <Rows surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
