import { Checkbox } from "@horon-ai/react";

export default function CheckboxSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
    </div>
  );
}
