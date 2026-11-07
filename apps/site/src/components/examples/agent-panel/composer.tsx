import { AgentPanel, TaskComposer } from "@horon-ai/react";
import { useState } from "react";

export default function AgentPanelComposer() {
  const [draft, setDraft] = useState("Triage overnight email and draft replies");
  return (
    <AgentPanel className="w-full max-w-168">
      <TaskComposer
        value={draft}
        onValueChange={setDraft}
        onStart={() => setDraft("")}
        placeholder="Describe a task for the chief of staff"
      />
    </AgentPanel>
  );
}
