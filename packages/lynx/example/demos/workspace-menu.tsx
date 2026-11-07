import { useState } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { WorkspaceMenu } from "../../src/components/workspace-menu";

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members" },
  { id: "labs", name: "Horon Labs", meta: "4 members" },
  { id: "personal", name: "Personal", meta: "Just you" },
];

/**
 * The Paper workspace switcher: a solid trigger showing the current workspace's
 * tile and name. `trigger` is the tile, `triggerChildren` the label row the
 * trigger is cloned around — the Lynx counterpart of React's `render` element.
 */
export default function WorkspaceMenuDemo() {
  const [value, setValue] = useState("hq");
  const current = workspaces.find((workspace) => workspace.id === value);
  const name = current?.name ?? "Workspace";

  return (
    <view className="flex w-full flex-col items-center gap-3 p-4">
      <WorkspaceMenu
        workspaces={workspaces}
        value={value}
        onValueChange={setValue}
        triggerClassName="gap-2 rounded-lg border border-border-default bg-bg-surface px-3 py-2"
        trigger={
          <view className="flex size-6 items-center justify-center rounded-sm bg-interactive-primary">
            <text className="text-label-sm text-text-inverse">{name.charAt(0)}</text>
          </view>
        }
        triggerChildren={
          <view className="flex flex-row items-center gap-1">
            <text className="text-label-md text-text-primary">{name}</text>
            <Icon name="CaretUpDown" size={14} color="text-secondary" />
          </view>
        }
      />
      <text className="text-caption text-text-secondary">{`current: ${value}`}</text>
    </view>
  );
}
