import { Checkbox } from "../../src/components/checkbox";

/** Every rung, the mixed state, and the disabled row, as the site demo shows them. */
export default function CheckboxDemo() {
  return (
    <view className="flex flex-col gap-3 p-4">
      <view className="flex flex-row flex-wrap items-center gap-4">
        <Checkbox size="sm" label="Small" defaultChecked />
        <Checkbox label="Medium" defaultChecked />
        <Checkbox size="lg" label="Large" defaultChecked />
      </view>
      <Checkbox label="Off" />
      <Checkbox label="On" defaultChecked />
      <Checkbox label="Mixed" indeterminate />
      <Checkbox label="Disabled" disabled defaultChecked />
    </view>
  );
}
