import { SegmentedControl } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function SegmentedControlDemo() {
  return (
    <Backdrop className="flex-col">
      <SegmentedControl
        aria-label="View"
        className="w-50"
        defaultValue="chat"
        items={[
          { value: "chat", label: "Chat" },
          { value: "work", label: "Work" },
        ]}
      />
      <SegmentedControl
        aria-label="Status"
        size="lg"
        defaultValue="running"
        items={[
          { value: "all", label: "All" },
          { value: "running", label: "Running" },
          { value: "done", label: "Done" },
        ]}
      />
    </Backdrop>
  );
}
