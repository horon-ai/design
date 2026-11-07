import { Switch } from "@horon-ai/react";

export default function SwitchSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Switch size="sm" label="Small" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
      <Switch size="lg" label="Large" defaultChecked />
      <Switch size="compact" label="Compact" defaultChecked />
    </div>
  );
}
