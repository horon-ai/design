import { Switch } from "@horon-ai/react";

export default function SwitchDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Switch size="sm" label="Small" defaultChecked />
        <Switch label="Medium" defaultChecked />
        <Switch size="lg" label="Large" defaultChecked />
      </div>
      <div className="flex w-64 flex-col gap-3">
        <Switch className="w-full justify-between" label="Morning brief" defaultChecked />
        <Switch className="w-full justify-between" label="Weekly report" />
        <Switch className="w-full justify-between" label="Paused" disabled />
      </div>
    </div>
  );
}
