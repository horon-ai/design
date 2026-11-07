import { BotMemoryPanel, type BotMemoryToast } from "@horon-ai/react";
import { useState } from "react";

const update: BotMemoryToast = { title: "Memory updated", message: "Noted: replies under 120 words" };

export default function BotMemoryPanelToast() {
  const [toast, setToast] = useState<BotMemoryToast | undefined>(update);
  return (
    <div className="flex w-full justify-center">
      <BotMemoryPanel
        usage={62}
        toast={toast}
        onToastDismiss={() => setToast(undefined)}
        memories={[
          {
            id: "1",
            group: "Preferences",
            text: "Wants replies under 120 words, investors read on phones",
            source: "From a chat · just now",
            fresh: true,
          },
          { id: "2", group: "Preferences", text: "Short answer first, details after", source: "Added by you · Oct 12" },
        ]}
        onAdd={() => setToast({ ...update })}
      />
    </div>
  );
}
