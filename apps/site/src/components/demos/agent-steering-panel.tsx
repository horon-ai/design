import { AgentSteeringPanel, type SteeringNote, type SteeringStep } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

const initialSteps: SteeringStep[] = [
  { id: "read", label: "Read 41 new emails", status: "done", time: "1.4s" },
  { id: "sort", label: "Sort the 6 that need you", status: "active", time: "4.5s" },
  { id: "draft", label: "Draft replies for the investor thread", status: "todo" },
  { id: "hold", label: "Hold the board deck for your yes", status: "todo" },
  { id: "send", label: "Send the morning brief", status: "todo" },
];

export default function AgentSteeringPanelDemo() {
  const [paused, setPaused] = useState(false);
  const [notes, setNotes] = useState<SteeringNote[]>([
    { id: "n1", text: "Keep replies under 120 words, the investors read on phones" },
  ]);
  return (
    <Backdrop>
      <AgentSteeringPanel
        title="Triage overnight email"
        subtitle="Chief of staff · Step 2 of 5"
        status={paused ? "Paused · 2m 10s" : "Running · 2m 10s"}
        paused={paused}
        onPausedChange={setPaused}
        steps={initialSteps}
        notes={notes}
        onApplyNow={(id) => setNotes((list) => list.map((note) => (note.id === id ? { ...note, applied: true } : note)))}
        onRemoveNote={(id) => setNotes((list) => list.filter((note) => note.id !== id))}
        onSteer={(text, interrupt) =>
          setNotes((list) => [...list, { id: `n${list.length + 1}-${Date.now()}`, text, applied: interrupt }])
        }
      />
    </Backdrop>
  );
}
