import { useState } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { PluginRow } from "../../src/components/plugin-row";
import { MenuItem } from "../../src/components/menu";

/** A live plugin row with its switch, its Update button and its overflow menu wired up. */
export default function PluginRowDemo() {
  const [enabled, setEnabled] = useState(true);
  const [update, setUpdate] = useState(true);

  return (
    <view className="flex w-full flex-col p-4">
      <view className="w-full max-w-[760px] rounded-2xl border border-border-default bg-bg-surface px-5">
        <PluginRow
          initials="GH"
          name="GitHub tools"
          version="v1.4.0"
          updateBadge={update ? "Update available" : undefined}
          author="by Horon Labs"
          verified
          chips={[
            { id: "repos", label: "Repos", icon: <Icon name="GitBranch" /> },
            { id: "code", label: "Code", icon: <Icon name="Code" /> },
            { id: "web", label: "Web", icon: <Icon name="Globe" /> },
          ]}
          enabled={enabled}
          onEnabledChange={setEnabled}
          onUpdate={update ? () => setUpdate(false) : undefined}
          menu={
            <view className="flex flex-col">
              <MenuItem>Details</MenuItem>
              <MenuItem danger>Uninstall</MenuItem>
            </view>
          }
        />
        <PluginRow
          className="border-b-0"
          initials="DB"
          name="Database console"
          version="v0.9.2"
          author="by Community"
          chips={[{ id: "sql", label: "SQL", icon: <Icon name="Code" /> }]}
          enabled={false}
        />
      </view>
      <text className="pt-3 text-caption text-text-secondary">{`enabled: ${enabled} · update: ${update}`}</text>
    </view>
  );
}
