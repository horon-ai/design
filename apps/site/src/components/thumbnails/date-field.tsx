import { DateField } from "@horon-ai/react";

export default function DateFieldThumbnail() {
  return (
    <div className="flex w-70 flex-col gap-2.5">
      <span className="text-label-md text-text-primary">Due date</span>
      <DateField value={new Date(2026, 7, 20)} locale="en-US" />
    </div>
  );
}
