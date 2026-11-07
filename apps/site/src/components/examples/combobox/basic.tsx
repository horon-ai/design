import { Combobox, type ComboboxItemData } from "@horon-ai/react";

const bots: ComboboxItemData[] = [
  { value: "chief", label: "Chief of staff", keywords: ["비서", "assistant"] },
  { value: "researcher", label: "Researcher", keywords: ["research", "조사"] },
  { value: "writer", label: "Writer", keywords: ["draft", "글"] },
  { value: "triage", label: "Inbox triage", keywords: ["email", "gmail", "메일"] },
  { value: "analyst", label: "Data analyst", keywords: ["sql", "chart"] },
];

export default function ComboboxBasic() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Combobox aria-label="Bot" items={bots} placeholder="Search a bot" />
      <Combobox aria-label="Bot, preset" items={bots} defaultValue="researcher" />
      <Combobox
        aria-label="Bot with a trailing note"
        items={bots.map((bot) => ({ ...bot, trailing: bot.value === "triage" ? "3 tasks" : undefined }))}
        placeholder="Search a bot"
      />
    </div>
  );
}
