import { FilterBar, type FilterBarItem } from "../../src/components/filter-bar";

/**
 * The default row and a row with one disabled option. Selection is uncontrolled
 * here (the site demo also leaves it uncontrolled), so the chip pill moves on tap.
 */
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
    <view className="flex w-full min-w-0 flex-col items-center gap-8 rounded-2xl bg-bg-surface p-4">
      <view className="flex w-full min-w-0 flex-col items-center gap-3">
        <text className="text-caption text-text-secondary">Default</text>
        <FilterBar items={items} defaultValue="all" />
      </view>
      <view className="flex w-full min-w-0 flex-col items-center gap-3">
        <text className="text-caption text-text-secondary">Selected with a disabled option</text>
        <FilterBar items={withDisabled} defaultValue="review" />
      </view>
    </view>
  );
}
