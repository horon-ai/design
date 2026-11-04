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

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Combobox aria-label="Bot" items={bots} surface={surface} size="sm" placeholder="Small" />
        <Combobox aria-label="Bot" items={bots} surface={surface} placeholder="Medium" />
        <Combobox aria-label="Bot" items={bots} surface={surface} size="lg" placeholder="Large" />
      </div>
      <Combobox aria-label="Bot" items={bots} surface={surface} placeholder="Search a bot" defaultValue="writer" />
      <Combobox
        aria-label="Bots"
        items={bots}
        surface={surface}
        multiple
        placeholder="Add bots"
        defaultValue={["chief"]}
      />
      <Combobox aria-label="Bots" items={bots} surface={surface} multiple placeholder="Add bots" />
      <Combobox aria-label="Bot" items={bots} surface={surface} invalid placeholder="Search a bot" />
    </div>
  );
}

export default function ComboboxDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
