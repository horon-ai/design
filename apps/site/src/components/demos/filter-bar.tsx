import { FilterBar, type FilterBarItem } from "@horon-ai/react";

const items: FilterBarItem[] = [
  { value: "all", label: "All", count: 4 },
  { value: "running", label: "Running", count: 1 },
  { value: "review", label: "Needs review", count: 1 },
  { value: "failed", label: "Failed", count: 1 },
  { value: "done", label: "Done", count: 1 },
];

const withDisabled = items.map((item) => (item.value === "failed" ? { ...item, disabled: true } : item));

export default function FilterBarDemo() {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-8 rounded-2xl bg-bg-surface p-4 sm:p-8">
      <div className="flex w-full min-w-0 flex-col items-center gap-3">
        <p className="text-caption text-text-secondary">Default</p>
        <FilterBar items={items} defaultValue="all" />
      </div>
      <div className="flex w-full min-w-0 flex-col items-center gap-3">
        <p className="text-caption text-text-secondary">Selected with a disabled option</p>
        <FilterBar items={withDisabled} defaultValue="review" />
      </div>
    </div>
  );
}
