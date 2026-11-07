import { AgentSteeringPanel, type SteeringStep } from "@horon-ai/react";
import { useState } from "react";

const steps: SteeringStep[] = [
  { id: "read", label: "Read the Q3 sheet", status: "done", time: "1.1s" },
  { id: "summarise", label: "Summarise the rows", status: "active", time: "6.2s" },
  { id: "draft", label: "Draft the cover note", status: "todo" },
];

export default function AgentSteeringPaused() {
  const [paused, setPaused] = useState(true);
  return (
    <AgentSteeringPanel
      title="Quarterly revenue review"
      subtitle="Researcher · Step 2 of 3"
      status={paused ? "Paused · 6.2s" : "Running · 6.2s"}
      paused={paused}
      onPausedChange={setPaused}
      steps={steps}
      onSteer={() => undefined}
    />
  );
}
