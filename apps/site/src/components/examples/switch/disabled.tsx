import { Switch } from "@horon-ai/react";

export default function SwitchDisabled() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-3">
      <Switch className="w-full justify-between" label="Sync while the bot runs" disabled defaultChecked />
      <Switch className="w-full justify-between" label="Delete chat history" disabled />
      <Switch size="compact" label="Paused" disabled />
    </div>
  );
}
