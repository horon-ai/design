import { Textarea } from "@horon-ai/react";

export default function TextareaThumbnail() {
  return (
    <Textarea
      className="w-72"
      defaultValue="Summarise the inbox every morning and flag anything that needs a reply today."
    />
  );
}
