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

export default function SegmentedControlDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop className="flex-col">
        <SegmentedControl surface="glass" aria-label="View, small" size="sm" defaultValue="chat" items={views} />
        <SegmentedControl surface="glass" aria-label="View" className="w-50" defaultValue="chat" items={views} />
        <SegmentedControl surface="glass" aria-label="Status" size="lg" defaultValue="running" items={statuses} />
      </Backdrop>
      <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-bg-default p-4">
        <SegmentedControl aria-label="View, solid" size="sm" defaultValue="chat" items={views} />
        <SegmentedControl aria-label="View, solid" className="w-50" defaultValue="chat" items={views} />
        <SegmentedControl aria-label="Status, solid" size="lg" defaultValue="running" items={statuses} />
      </div>
    </div>
  );
}
