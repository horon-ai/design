import { AgentLane } from "@horon-ai/react";
import { FileText, MagnifyingGlass } from "@phosphor-icons/react";

export default function AgentLaneGrid() {
  return (
    <div className="grid w-full max-w-180 gap-3 sm:grid-cols-2">
      <AgentLane
        status="done"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Portfolio metrics"
        tool={{ icon: <MagnifyingGlass aria-hidden />, label: "Notion · Q3 metrics dashboard" }}
        output="Revenue up 18%, burn down to $210k a month"
        usage="2.6k tokens"
      />
      <AgentLane
        status="done"
        bot={{ initial: "W", name: "Writer" }}
        elapsed="3.4s"
        task="Draft the update email"
        tool={{ icon: <FileText aria-hidden />, label: "Docs · Investor update template" }}
        output="Draft ready: 4 sections, 320 words"
        usage="4.9k tokens"
      />
    </div>
  );
}
