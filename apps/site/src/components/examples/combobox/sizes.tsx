import { Combobox, type ComboboxItemData } from "@horon-ai/react";

const roles: ComboboxItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
];

export default function ComboboxSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-3">
      <Combobox className="w-44" aria-label="Bot, small" size="sm" items={roles} defaultValue="chief" />
      <Combobox className="w-44" aria-label="Bot, medium" size="md" items={roles} defaultValue="chief" />
      <Combobox className="w-44" aria-label="Bot, large" size="lg" items={roles} defaultValue="chief" />
      <Combobox
        className="w-52"
        aria-label="Reviewers, small"
        size="sm"
        items={roles}
        multiple
        defaultValue={["chief", "writer"]}
      />
    </div>
  );
}
