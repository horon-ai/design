import { BotMemoryPanel } from "@horon-ai/react";

export default function BotMemoryPanelMemory() {
  return (
    <div className="flex w-full justify-center">
      <BotMemoryPanel
        subtitle="What Chief of staff remembers across chats"
        usage={42}
        settings={[
          { id: "saved", label: "Use saved memories", description: "Reads and adds to the memories below", defaultChecked: true },
          { id: "history", label: "Use chat history", description: "Searches past chats when they help", defaultChecked: false },
        ]}
        memories={[
          { id: "1", group: "About you", text: "Runs Horon HQ, a 3 person team in Seoul", source: "From a chat · Oct 8" },
          { id: "2", group: "About you", text: "Works on Korea Standard Time, starts at 9 AM", source: "From a chat · Oct 8" },
          {
            id: "3",
            group: "Preferences",
            text: "Wants replies under 120 words, investors read on phones",
            source: "From a chat · Oct 12",
          },
        ]}
      />
    </div>
  );
}
