import { IconButton, WorkspaceMenu } from "@horon-ai/react";
import { SquaresFour } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members" },
  { id: "labs", name: "Horon Labs", meta: "4 members" },
];

export default function WorkspaceMenuGlassChrome() {
  return (
    <Backdrop>
      <WorkspaceMenu
        workspaces={workspaces}
        value="hq"
        trigger={<IconButton icon={<SquaresFour />} label="Switch workspace" variant="glass" />}
      />
    </Backdrop>
  );
}
