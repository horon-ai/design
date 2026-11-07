import { Checkbox } from "@horon-ai/react";

export default function CheckboxStates() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <Checkbox label="Off" />
      <Checkbox label="On" defaultChecked />
      <Checkbox label="Partly selected" indeterminate />
      <Checkbox label="Disabled on" disabled defaultChecked />
      <Checkbox label="Disabled off" disabled />
    </div>
  );
}
