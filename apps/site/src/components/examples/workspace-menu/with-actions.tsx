import { Button, WorkspaceMenu } from "@horon-ai/react";
import { useState } from "react";

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members", initial: "H" },
  { id: "labs", name: "Horon Labs", meta: "4 members", initial: "L" },
];

export default function WorkspaceMenuActions() {
  const [value, setValue] = useState("labs");

  return (
    <WorkspaceMenu
      workspaces={workspaces}
      value={value}
      onValueChange={setValue}
      onCreate={() => undefined}
      onSettings={() => undefined}
      label="Switch workspace"
      trigger={<Button variant="solid" />}
      triggerChildren="Workspace"
    />
  );
}
