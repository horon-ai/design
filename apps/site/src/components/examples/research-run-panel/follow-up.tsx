import { ResearchRunPanel } from "@horon-ai/react";
import { useState } from "react";

export default function ResearchRunPanelFollowUp() {
  const [asked, setAsked] = useState<string[]>([]);
  const [running, setRunning] = useState(true);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ResearchRunPanel
        question="Which seed investors led AI agent rounds in Korea this year?"
        running={running}
        statusLabel="Reading sources"
        elapsed="12s"
        read={2}
        total={5}
        queries={[{ id: "q1", text: "seed round AI agent startup Korea 2026", results: "16 results" }]}
        onStop={() => setRunning(false)}
        onNewResearch={() => setRunning(true)}
        onToggleStatus={() => undefined}
        followUpPlaceholder="Ask a follow-up"
        onFollowUp={(value) => setAsked((previous) => [...previous, value])}
      />
      <p className="text-caption text-text-secondary">
        {asked.length === 0 ? "No follow-up sent yet" : `Sent: ${asked.join(" · ")}`}
      </p>
    </div>
  );
}
