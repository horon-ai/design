import { Switch } from "@horon-ai/react";

export default function SwitchDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Morning brief" defaultChecked />
      <Switch label="Weekly report" />
      <Switch label="Paused" disabled />
    </div>
  );
}
