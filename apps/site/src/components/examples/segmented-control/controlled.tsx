import { SegmentedControl } from "@horon-ai/react";
import { useState } from "react";

const views = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export default function SegmentedControlControlled() {
  const [view, setView] = useState("active");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SegmentedControl
        aria-label="Projects"
        value={view}
        onValueChange={setView}
        items={views}
        className="w-56"
      />
      <p className="text-caption text-text-secondary">Showing {view} projects</p>
    </div>
  );
}
