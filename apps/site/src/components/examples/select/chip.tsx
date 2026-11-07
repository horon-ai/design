import { Select, type SelectItemData } from "@horon-ai/react";
import { Funnel } from "@phosphor-icons/react";

const ranges: SelectItemData[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const owners: SelectItemData[] = [
  { value: "me", label: "Assigned to me" },
  { value: "team", label: "Whole team" },
  { value: "none", label: "Unassigned" },
];

export default function SelectChip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Select variant="chip" aria-label="Date range" items={ranges} defaultValue="week" />
      <Select variant="chip" aria-label="Owner" items={owners} defaultValue="me" />
      <Select
        variant="chip"
        aria-label="Owner, no caret"
        items={owners}
        defaultValue="team"
        showIndicator={false}
      />
      <span className="flex items-center gap-1 text-label-md text-text-secondary">
        <Funnel aria-hidden /> Filters
      </span>
    </div>
  );
}
