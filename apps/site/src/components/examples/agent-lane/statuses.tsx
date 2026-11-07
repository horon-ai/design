import { AgentLane } from "@horon-ai/react";
import { EnvelopeSimple, MagnifyingGlass } from "@phosphor-icons/react";

export default function AgentLaneStatuses() {
  return (
    <div className="flex w-full max-w-140 flex-col gap-3">
      <AgentLane
        status="running"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Portfolio metrics"
        tool={{ icon: <MagnifyingGlass aria-hidden />, label: "Notion · Q3 metrics dashboard" }}
      />
      <AgentLane
        status="done"
        bot={{ initial: "W", name: "Writer" }}
        elapsed="3.4s"
        task="Draft the update email"
        tool={{ icon: <MagnifyingGlass aria-hidden />, label: "Docs · Investor update template" }}
        output="Draft ready: 4 sections, 320 words"
        usage="4.9k tokens"
      />
      <AgentLane
        status="failed"
        bot={{ initial: "I", name: "Inbox triage" }}
        elapsed="1.2s"
        task="Collect open investor questions"
        tool={{ icon: <EnvelopeSimple aria-hidden />, label: "Gmail · investor threads, last 30 days" }}
        output="Gmail access expired. Reconnect to continue."
        usage="0.4k tokens"
      />
    </div>
  );
}
