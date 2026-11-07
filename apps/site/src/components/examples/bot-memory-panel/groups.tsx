import { BotMemoryPanel } from "@horon-ai/react";
import { useState } from "react";

const memories = [
  { id: "1", group: "About you", text: "Runs Horon HQ, a 3 person team in Seoul", source: "From a chat · Oct 8" },
  { id: "2", group: "About you", text: "Works on Korea Standard Time, starts at 9 AM", source: "From a chat · Oct 8" },
  { id: "3", group: "People", text: "Lena Brunner handles invoices at Fjord Analytics", source: "From a chat · Oct 14" },
  { id: "4", group: "People", text: "Mateo Ruiz owns the Q3 deck", source: "From a chat · Oct 2" },
  { id: "5", group: "Preferences", text: "Short answer first, details after", source: "Added by you · Oct 12" },
];

export default function BotMemoryPanelGroups() {
  const [log, setLog] = useState("No switch flipped yet");
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <BotMemoryPanel
        subtitle="What Chief of staff remembers across chats"
        usage={88}
        settings={[
          { id: "saved", label: "Use saved memories", description: "Reads and adds to the memories below", defaultChecked: true },
        ]}
        onSettingChange={(id, checked) => setLog(`${id}: ${checked ? "on" : "off"}`)}
        memories={memories}
        onAdd={() => setLog("Add memory pressed")}
        onSearch={() => setLog("Search pressed")}
      />
      <p className="text-caption text-text-secondary">{log}</p>
    </div>
  );
}
