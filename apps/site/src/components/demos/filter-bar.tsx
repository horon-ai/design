import { FilterBar } from "@horon-ai/react";

const items = [
  { value: "all", label: "All", count: 4 },
  { value: "running", label: "Running", count: 1 },
  { value: "review", label: "Needs review", count: 1 },
  { value: "failed", label: "Failed", count: 1 },
  { value: "done", label: "Done", count: 1 },
];

export default function FilterBarDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-bg-surface p-8">
      <FilterBar items={items} defaultValue="all" />
      <FilterBar items={items} defaultValue="review" />
    </div>
  );
}
