import { Select } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const items = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage" },
];

function Fields({ surface }: { surface: "solid" | "glass" }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Select aria-label="Bot" items={items} surface={surface} size="sm" placeholder="Small" className="w-44" />
        <Select aria-label="Bot" items={items} surface={surface} placeholder="Medium" className="w-44" />
        <Select aria-label="Bot" items={items} surface={surface} size="lg" placeholder="Large" className="w-44" />
      </div>
      <Select aria-label="Bot" items={items} surface={surface} placeholder="Select a bot" />
      <Select
        aria-label="Bot"
        items={items}
        surface={surface === "glass" ? "glass" : "solid-on-page"}
        defaultValue="chief"
      />
    </>
  );
}

export default function SelectDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-col items-center gap-4">
          <Fields surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <Fields surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
