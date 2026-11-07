import { AgentLanesTimeline, type LaneBot } from "@horon-ai/react";
import { Envelope, Folder } from "@phosphor-icons/react";

const bots: LaneBot[] = [
  {
    id: "researcher",
    name: "Researcher",
    tools: "Notion · Gmail",
    initial: "R",
    tone: "sky",
    tasks: [
      { id: "portfolio", label: "Portfolio metrics", icon: <Folder />, tone: "done", start: -28, end: -16 },
      { id: "questions", label: "Investor questions", icon: <Envelope />, tone: "running", start: -9, end: 0 },
    ],
  },
  {
    id: "writer",
    name: "Writer",
    tools: "Docs",
    initial: "W",
    tone: "steel",
    tasks: [{ id: "update", label: "Draft investor update", tone: "running", start: -14, end: 0 }],
  },
];

export default function AgentLanesTimelineLanes() {
  return (
    <div className="flex w-full justify-center">
      <AgentLanesTimeline bots={bots} />
    </div>
  );
}
