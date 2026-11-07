import { Switch } from "@horon-ai/react";

export default function SwitchSettings() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-3">
      <Switch className="w-full justify-between" label="Morning brief" defaultChecked />
      <Switch className="w-full justify-between" label="Weekly report" defaultChecked />
      <Switch className="w-full justify-between" label="Product updates" />
      <Switch className="w-full justify-between" size="compact" label="Remember this bot's memory" defaultChecked />
    </div>
  );
}
