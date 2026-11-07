import { Select, type SelectItemData } from "@horon-ai/react";

const roles: SelectItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
];

export default function SelectSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-3">
      <Select className="w-44" aria-label="Bot role, small" size="sm" items={roles} defaultValue="chief" />
      <Select className="w-44" aria-label="Bot role, medium" size="md" items={roles} defaultValue="chief" />
      <Select className="w-44" aria-label="Bot role, large" size="lg" items={roles} defaultValue="chief" />
    </div>
  );
}
