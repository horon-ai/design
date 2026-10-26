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
      <Select aria-label="Bot" items={items} placeholder="Select a bot" />
      <Select aria-label="Bot" items={items} surface="solid" defaultValue="chief" />
    </Backdrop>
  );
}
