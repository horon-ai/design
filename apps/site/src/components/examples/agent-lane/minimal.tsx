import { AgentLane } from "@horon-ai/react";

export default function AgentLaneMinimal() {
  return (
    <div className="flex w-full max-w-140 flex-col gap-3">
      <AgentLane status="running" bot={{ initial: "R", name: "Researcher" }} task="Gather the Q3 metrics" />
      <AgentLane status="done" bot={{ initial: "R", name: "Researcher" }} elapsed="1.9s" task="Gather the Q3 metrics" />
    </div>
  );
}
