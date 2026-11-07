import { AgentLane } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function AgentLaneThumbnail() {
  return (
    <div className="w-80">
      <AgentLane
        status="running"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Portfolio metrics"
        tool={{ icon: <MagnifyingGlass aria-hidden />, label: "Notion · Q3 metrics dashboard" }}
        output="Revenue up 18%, burn down to $210k a month"
        usage="2.6k tokens"
      />
    </div>
  );
}
