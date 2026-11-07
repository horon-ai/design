import { SegmentedControl } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

const statuses = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "done", label: "Done" },
];

export default function SegmentedControlSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-wrap items-center justify-center gap-4 rounded-md border border-border-default bg-bg-surface px-4 py-6">
        <div className="flex flex-col items-center gap-1">
          <SegmentedControl aria-label="Status, solid" surface="solid" defaultValue="all" items={statuses} />
          <span className="text-caption text-text-secondary">solid</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SegmentedControl aria-label="Status, inset" surface="inset" defaultValue="all" items={statuses} />
          <span className="text-caption text-text-secondary">inset</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SegmentedControl
            aria-label="Status, inset faint"
            surface="inset-faint"
            defaultValue="all"
            items={statuses}
          />
          <span className="text-caption text-text-secondary">inset-faint</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SegmentedControl aria-label="Status, subtle" surface="subtle" defaultValue="all" items={statuses} />
          <span className="text-caption text-text-secondary">subtle</span>
        </div>
      </div>
      <Backdrop className="flex-col">
        <SegmentedControl aria-label="Status, glass" surface="glass" defaultValue="running" items={statuses} />
        <span className="text-caption text-text-secondary">glass</span>
      </Backdrop>
    </div>
  );
}
