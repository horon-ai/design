import { Select, type SelectItemData } from "@horon-ai/react";

const roles: SelectItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "recruiter", label: "Recruiter", disabled: true },
  { value: "triage", label: "Inbox triage" },
];

export default function SelectStates() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Select aria-label="Bot role, invalid" items={roles} invalid placeholder="Choose a role" />
      <Select aria-label="Bot role, disabled" items={roles} disabled placeholder="Locked while the bot runs" />
      <Select
        aria-label="Bot role with a disabled row"
        items={roles}
        defaultValue="chief"
        surface="glass"
      />
    </div>
  );
}
