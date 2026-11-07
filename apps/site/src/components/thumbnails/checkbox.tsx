import { Checkbox } from "@horon-ai/react";

export default function CheckboxThumbnail() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox label="Daily summary" defaultChecked />
      <Checkbox label="Weekly report" />
    </div>
  );
}
