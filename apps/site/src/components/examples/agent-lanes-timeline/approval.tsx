import { AgentLanesTimeline, type LaneBot } from "@horon-ai/react";
import { Envelope, WarningCircle } from "@phosphor-icons/react";

const bots: LaneBot[] = [
  {
    id: "researcher",
    name: "Researcher",
    initial: "R",
    tone: "sky",
    tasks: [{ id: "portfolio", label: "Portfolio metrics", tone: "done", start: -28, end: -16 }],
  },
  {
    id: "chief",
    name: "Chief of staff",
    tools: "Gmail · Calendar",
    initial: "C",
    tone: "ink",
    badge: "Needs you",
    badgeTone: "ink",
    tasks: [
      { id: "interviews", label: "Book interviews", icon: <WarningCircle />, tone: "failed", start: -28, end: -21 },
      {
        id: "send",
        label: "Send to 12 investors",
        icon: <Envelope />,
        tone: "waiting",
        start: -12,
        end: 0,
        badge: "Needs you",
      },
    ],
  },
];

export default function AgentLanesTimelineApproval() {
  return (
    <div className="flex w-full justify-center">
      <AgentLanesTimeline
        bots={bots}
        approval={{
          message: "Chief of staff wants your yes before emailing 12 investors",
          onLater: () => undefined,
          onApprove: () => undefined,
        }}
      />
    </div>
  );
}
