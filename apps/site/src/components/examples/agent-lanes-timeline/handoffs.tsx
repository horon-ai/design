import { AgentLanesTimeline, type LaneBot, type LaneHandoff } from "@horon-ai/react";
import { FileText } from "@phosphor-icons/react";

const bots: LaneBot[] = [
  {
    id: "researcher",
    name: "Researcher",
    tools: "Notion",
    initial: "R",
    tone: "sky",
    tasks: [{ id: "pull", label: "Pull metrics", tone: "done", start: -28, end: -17 }],
  },
  {
    id: "writer",
    name: "Writer",
    tools: "Docs",
    initial: "W",
    tone: "steel",
    tasks: [{ id: "draft", label: "Draft summary", icon: <FileText />, tone: "done", start: -17, end: -4 }],
  },
  {
    id: "reviewer",
    name: "Reviewer",
    tools: "Docs",
    initial: "V",
    tone: "neutral",
    tasks: [{ id: "check", label: "Check numbers", tone: "waiting", start: -4, end: 0 }],
  },
];

const handoffs: LaneHandoff[] = [
  { from: "pull", to: "draft" },
  { from: "draft", to: "check" },
];

export default function AgentLanesTimelineHandoffs() {
  return (
    <div className="flex w-full justify-center">
      <AgentLanesTimeline
        statuses={[
          { id: "running", tone: "live", label: "2 running" },
          { id: "waiting", tone: "ink", label: "1 waiting" },
        ]}
        bots={bots}
        handoffs={handoffs}
        range="Last 30m"
      />
    </div>
  );
}
