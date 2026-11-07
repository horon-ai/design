import { SegmentedControl } from "@horon-ai/react";

const views = [
  { value: "chat", label: "Chat" },
  { value: "work", label: "Work" },
];

export default function SegmentedControlSizes() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-1">
        <SegmentedControl aria-label="View, small" size="sm" defaultValue="chat" items={views} />
        <span className="text-caption text-text-secondary">sm</span>
      </div>
      <div className="flex w-full flex-col items-center gap-1">
        <SegmentedControl aria-label="View" defaultValue="chat" items={views} />
        <span className="text-caption text-text-secondary">md</span>
      </div>
      <div className="flex w-full flex-col items-center gap-1">
        <SegmentedControl aria-label="View, large" size="lg" defaultValue="chat" items={views} />
        <span className="text-caption text-text-secondary">lg</span>
      </div>
    </div>
  );
}
