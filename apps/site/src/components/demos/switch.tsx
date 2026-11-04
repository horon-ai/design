import { Switch } from "@horon-ai/react";

export default function SwitchDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <Switch size="sm" label="Small" defaultChecked />
        <Switch label="Medium" defaultChecked />
        <Switch size="lg" label="Large" defaultChecked />
      </div>
      <Switch label="Morning brief" defaultChecked />
      <Switch label="Weekly report" />
      <Switch label="Paused" disabled />
    </div>
  );
}
