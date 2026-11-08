import { Switch } from "../../src/components/switch";

/** The rungs side by side, then a label row stack with a disabled switch. */
export default function SwitchDemo() {
  return (
    <view className="flex flex-col gap-4 p-4">
      <view className="flex flex-row flex-wrap items-center gap-4">
        <Switch size="sm" label="Small" defaultChecked />
        <Switch label="Medium" defaultChecked />
        <Switch size="lg" label="Large" defaultChecked />
      </view>
      <view className="flex w-full min-w-0 max-w-64 flex-col gap-3">
        <Switch className="w-full justify-between" label="Morning brief" defaultChecked />
        <Switch className="w-full justify-between" label="Weekly report" />
        <Switch className="w-full justify-between" label="Paused" disabled />
      </view>
    </view>
  );
}
