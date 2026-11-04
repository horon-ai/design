import { Combobox, type ComboboxItemData } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const bots: ComboboxItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage", keywords: ["email", "gmail"] },
  { value: "analyst", label: "Data analyst" },
  { value: "recruiter", label: "Recruiter", disabled: true },
];

export default function ComboboxDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Combobox aria-label="Bot" items={bots} size="sm" placeholder="Small" />
        <Combobox aria-label="Bot" items={bots} placeholder="Medium" />
        <Combobox aria-label="Bot" items={bots} size="lg" placeholder="Large" />
      </div>
      <Combobox aria-label="Bot" items={bots} placeholder="Search a bot" defaultValue="writer" />
      <Combobox aria-label="Bots" items={bots} multiple placeholder="Add bots" defaultValue={["chief", "triage"]} />
      <Combobox aria-label="Bots" items={bots} multiple surface="glass" placeholder="Add bots" />
      <Combobox aria-label="Bot" items={bots} invalid placeholder="Search a bot" />
    </Backdrop>
  );
}
