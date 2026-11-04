import { Checkbox } from "@horon-ai/react";

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox size="sm" label="Small" defaultChecked />
        <Checkbox label="Medium" defaultChecked />
        <Checkbox size="lg" label="Large" defaultChecked />
      </div>
      <Checkbox label="Off" />
      <Checkbox label="On" defaultChecked />
      <Checkbox label="Mixed" indeterminate />
      <Checkbox label="Disabled" disabled defaultChecked />
    </div>
  );
}
