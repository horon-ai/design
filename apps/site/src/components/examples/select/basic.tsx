import { Select, type SelectItemData } from "@horon-ai/react";

const roles: SelectItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage" },
];

const countries: SelectItemData[] = [
  { value: "KR", label: "+82 South Korea", selectedLabel: "+82" },
  { value: "US", label: "+1 United States", selectedLabel: "+1" },
  { value: "JP", label: "+81 Japan", selectedLabel: "+81" },
];

export default function SelectBasic() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Select aria-label="Bot role" items={roles} placeholder="Choose a role" />
      <Select aria-label="Bot role, preset" items={roles} defaultValue="researcher" />
      <Select aria-label="Country code" items={countries} defaultValue="KR" />
    </div>
  );
}
