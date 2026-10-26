import { Checkbox } from "@horon-ai/react";

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="Off" />
      <Checkbox label="On" defaultChecked />
      <Checkbox label="Mixed" indeterminate />
      <Checkbox label="Disabled" disabled defaultChecked />
    </div>
  );
}
