import { FilterBar, type FilterBarItem } from "@horon-ai/react";

const items: FilterBarItem[] = [
  { value: "all", label: "All", count: 4 },
  { value: "running", label: "Running", count: 1 },
  { value: "review", label: "Needs review", count: 1 },
  { value: "failed", label: "Failed", count: 1, disabled: true },
  { value: "done", label: "Done", count: 1 },
];

export default function FilterBarDisabled() {
  return (
    <div className="flex w-full min-w-0 justify-center">
      <FilterBar aria-label="Status" items={items} defaultValue="review" />
    </div>
  );
}
