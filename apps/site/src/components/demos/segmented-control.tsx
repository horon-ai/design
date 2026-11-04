import { SegmentedControl } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const views = [
  { value: "chat", label: "Chat" },
  { value: "work", label: "Work" },
];

const statuses = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "done", label: "Done" },
];

function Controls({ surface }: { surface: "solid" | "glass" | "subtle" }) {
  return (
    <>
      <SegmentedControl surface={surface} aria-label="View, small" size="sm" defaultValue="chat" items={views} />
      <SegmentedControl surface={surface} aria-label="View" className="w-50" defaultValue="chat" items={views} />
      <SegmentedControl surface={surface} aria-label="Status" size="lg" defaultValue="running" items={statuses} />
    </>
  );
}

export default function SegmentedControlDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Controls surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Subtle</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Controls surface="subtle" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <Controls surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
