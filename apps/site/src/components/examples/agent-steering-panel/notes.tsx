import { AgentSteeringPanel, type SteeringNote, type SteeringStep } from "@horon-ai/react";
import { useState } from "react";

const steps: SteeringStep[] = [
  { id: "read", label: "Read the standup notes", status: "done", time: "0.9s" },
  { id: "group", label: "Group the blockers by owner", status: "active", time: "2.4s" },
  { id: "send", label: "Send the standup summary", status: "todo" },
];

export default function AgentSteeringNotes() {
  const [notes, setNotes] = useState<SteeringNote[]>([
    { id: "applied", text: "Skip the design thread, it is already resolved", applied: true },
    { id: "queued", text: "Name the owners in the summary, not just their teams" },
  ]);
  return (
    <AgentSteeringPanel
      title="Summarize the weekly standup"
      subtitle="Chief of staff · Step 2 of 3"
      status="Running · 3.3s"
      steps={steps}
      notes={notes}
      onApplyNow={(id) =>
        setNotes((list) => list.map((note) => (note.id === id ? { ...note, applied: true } : note)))
      }
      onRemoveNote={(id) => setNotes((list) => list.filter((note) => note.id !== id))}
      onSteer={() => undefined}
    />
  );
}
