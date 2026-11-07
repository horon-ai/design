import { Switch } from "@horon-ai/react";

export default function SwitchThumbnail() {
  return (
    <div className="flex w-64 flex-col gap-4">
      <Switch className="w-full justify-between" label="Morning brief" defaultChecked />
      <Switch className="w-full justify-between" label="Weekly report" />
    </div>
  );
}
