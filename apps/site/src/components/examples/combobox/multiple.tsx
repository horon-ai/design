import { Combobox, type ComboboxItemData } from "@horon-ai/react";

const teammates: ComboboxItemData[] = [
  { value: "mina", label: "Mina Park", keywords: ["design", "디자인"] },
  { value: "jun", label: "Jun Lee", keywords: ["backend"] },
  { value: "sora", label: "Sora Kim", keywords: ["research"] },
  { value: "dev", label: "Dev Patel", keywords: ["ops"] },
];

export default function ComboboxMultiple() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Combobox aria-label="Reviewers" items={teammates} multiple placeholder="Add reviewers" />
      <Combobox aria-label="Reviewers, preset" items={teammates} multiple defaultValue={["mina", "jun"]} />
      <Combobox aria-label="Reviewers, invalid" items={teammates} multiple invalid placeholder="Add reviewers" />
    </div>
  );
}
