import {
  formatShortcut,
  SettingsKey,
  SettingsKeys,
  SettingsList,
  SettingsRow,
  usePlatform,
} from "@horon-ai/react";

export default function SettingsListKeys() {
  const { os } = usePlatform();
  return (
    <SettingsList className="w-full max-w-120">
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
        title="New chat"
        description="Starts a fresh conversation with the bot in view."
        control={
          <SettingsKeys>
            <SettingsKey>{formatShortcut("Mod", os)}</SettingsKey>
            <SettingsKey>N</SettingsKey>
          </SettingsKeys>
        }
      />
    </SettingsList>
  );
}
