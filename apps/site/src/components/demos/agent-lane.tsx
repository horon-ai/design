import { AgentLane } from "@horon-ai/react";
import { EnvelopeSimple, MagnifyingGlass } from "@phosphor-icons/react";

export default function AgentLaneDemo() {
  return (
    <div className="flex w-full max-w-140 flex-col gap-3">
      <AgentLane
        status="running"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Portfolio metrics"
        tool={{ icon: <MagnifyingGlass />, label: "Notion · Q3 metrics dashboard" }}
        output="Revenue up 18%, burn down to $210k a month"
        usage="2.6k tokens"
      />
      <AgentLane
        status="failed"
        bot={{ initial: "I", name: "Inbox triage" }}
        elapsed="1.2s"
        task="Collect open investor questions"
        tool={{ icon: <EnvelopeSimple />, label: "Gmail · investor threads, last 30 days" }}
        output="Gmail access expired. Reconnect to continue."
        usage="0.4k tokens"
      />
    </div>
  );
}
