import { Combobox, type ComboboxItemData } from "@horon-ai/react";

const bots: ComboboxItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
];

const members: ComboboxItemData[] = [];

export default function ComboboxStates() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Combobox aria-label="Bot, empty results" items={members} emptyLabel="No bots match" placeholder="Search a bot" />
      <Combobox aria-label="Bot, invalid" items={bots} invalid placeholder="Search a bot" />
      <Combobox aria-label="Bot, disabled" items={bots} disabled placeholder="Locked while the bot runs" />
    </div>
  );
}
