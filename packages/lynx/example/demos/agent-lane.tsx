import { AgentLane } from "../../src/components/agent-lane";
import { Icon } from "../../src/icons";

/** The two lanes the site demo draws: one running with a tool, one failed with its error. */
export default function AgentLaneDemo() {
  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full max-w-[560px] flex-col gap-3">
        <AgentLane
          status="running"
          bot={{ initial: "R", name: "Researcher" }}
          elapsed="1.9s"
          task="Portfolio metrics"
          tool={{
            icon: <Icon name="MagnifyingGlass" size={14} color="text-secondary" />,
            label: "Notion · Q3 metrics dashboard",
          }}
          output="Revenue up 18%, burn down to $210k a month"
          usage="2.6k tokens"
        />
        <AgentLane
          status="failed"
          bot={{ initial: "I", name: "Inbox triage" }}
          elapsed="1.2s"
          task="Collect open investor questions"
          tool={{
            icon: <Icon name="EnvelopeSimple" size={14} color="text-secondary" />,
            label: "Gmail · investor threads, last 30 days",
          }}
          output="Gmail access expired. Reconnect to continue."
          usage="0.4k tokens"
        />
      </view>
    </view>
  );
}
