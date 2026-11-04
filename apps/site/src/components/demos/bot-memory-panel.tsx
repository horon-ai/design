import { BotMemoryPanel, Button, type BotMemoryToast } from "@horon-ai/react";
import { useState } from "react";

const initialToast: BotMemoryToast = { title: "Memory updated", message: "Noted: you prefer replies under 120 words" };

export default function BotMemoryPanelDemo() {
  const [toast, setToast] = useState<BotMemoryToast | undefined>(initialToast);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <BotMemoryPanel
        subtitle="What Chief of staff remembers across chats"
        usage={62}
        settings={[
          {
            id: "saved",
            label: "Use saved memories",
            description: "Reads and adds to the memories below",
            defaultChecked: true,
          },
          {
            id: "history",
            label: "Use chat history",
            description: "Searches past chats when they help",
            defaultChecked: true,
          },
        ]}
        toast={toast}
        onToastDismiss={() => setToast(undefined)}
        memories={[
          {
            id: "1",
            group: "About you",
            text: "Runs Horon HQ, a 3 person team in Seoul",
            source: "From a chat · Oct 8",
          },
          {
            id: "2",
            group: "About you",
            text: "Works on Korea Standard Time, starts at 9 AM",
            source: "From a chat · Oct 8",
          },
          {
            id: "3",
            group: "Preferences",
            text: "Wants replies under 120 words, investors read on phones",
            source: "From a chat · just now",
            fresh: true,
          },
          { id: "4", group: "Preferences", text: "Short answer first, details after", source: "Added by you · Oct 12" },
          {
            id: "5",
            group: "People",
            text: "Lena Brunner handles invoices at Fjord Analytics",
            source: "From a chat · Oct 14",
          },
        ]}
      />
      <Button variant="solid" size="sm" onClick={() => setToast({ ...initialToast })}>
        Show a new memory update
      </Button>
    </div>
  );
}
