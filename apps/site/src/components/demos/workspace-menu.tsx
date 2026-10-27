import { Button, WorkspaceMenu } from "@horon-ai/react";
import { useState } from "react";

const workspaces = [
  { id: "hq", name: "Horon HQ", meta: "12 members" },
  { id: "labs", name: "Horon Labs", meta: "4 members" },
  { id: "personal", name: "Personal", meta: "Just you" },
];

export default function WorkspaceMenuDemo() {
  const [value, setValue] = useState("hq");
  const current = workspaces.find((workspace) => workspace.id === value);
  return (
    <WorkspaceMenu
      workspaces={workspaces}
      value={value}
      onValueChange={setValue}
      trigger={<Button variant="glass" />}
      triggerChildren={current?.name}
    />
  );
}
