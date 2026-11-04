import { Select } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const items = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage" },
];

export default function SelectDemo() {
  return (
    <Backdrop>
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Select aria-label="Bot" items={items} size="sm" placeholder="Small" className="max-w-44" />
        <Select aria-label="Bot" items={items} placeholder="Medium" className="max-w-44" />
        <Select aria-label="Bot" items={items} size="lg" placeholder="Large" className="max-w-44" />
      </div>
      <Select aria-label="Bot" items={items} placeholder="Select a bot" />
      <Select aria-label="Bot" items={items} surface="glass" defaultValue="chief" />
      <Select aria-label="Bot" items={items} surface="solid-on-page" defaultValue="chief" />
    </Backdrop>
  );
}
