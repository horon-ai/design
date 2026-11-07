import { SegmentedControl, type SegmentedControlSurface } from "../../src/components/segmented-control";

import { Backdrop } from "./backdrop";

const views = [
  { value: "chat", label: "Chat" },
  { value: "work", label: "Work" },
];

const statuses = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "done", label: "Done" },
];

function Controls({ surface }: { surface: SegmentedControlSurface }) {
  return (
    <view className="flex flex-row flex-wrap items-center justify-center gap-4">
      <SegmentedControl surface={surface} aria-label="View, small" size="sm" defaultValue="chat" items={views} />
      <SegmentedControl surface={surface} aria-label="View" className="w-[200px]" defaultValue="chat" items={views} />
      <SegmentedControl surface={surface} aria-label="Status" size="lg" defaultValue="running" items={statuses} />
    </view>
  );
}

/** The three track treatments the design uses, each with the three rungs. */
export default function SegmentedControlDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Controls surface="solid" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Subtle</text>
        <Controls surface="subtle" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop>
          <Controls surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
