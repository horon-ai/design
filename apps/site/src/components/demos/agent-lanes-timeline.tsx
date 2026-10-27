import { AgentLanesTimeline, type LaneBot } from "@horon-ai/react";
import { Envelope, FileText, Folder, Warning, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

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
    tasks: [{ id: "update", label: "Draft investor update", icon: <FileText />, tone: "running", start: -14, end: 0 }],
  },
  {
    id: "reviewer",
    name: "Reviewer",
    tools: "Docs",
    initial: "V",
    tone: "neutral",
    badge: "Idle",
    tasks: [{ id: "deck", label: "Review Q3 deck", icon: <FileText />, tone: "done", start: -30, end: -19 }],
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
        badge: (
          <>
            <Warning />
            Needs you
          </>
        ),
      },
    ],
  },
];

export default function AgentLanesTimelineDemo() {
  const [cursor, setCursor] = useState(0);
  return (
    <Backdrop className="flex-col">
      <AgentLanesTimeline
        statuses={[
          { id: "running", tone: "live", label: "2 running" },
          { id: "needs", tone: "ink", label: "1 needs you" },
        ]}
        bots={bots}
        handoffs={[{ from: "portfolio", to: "update" }]}
        cursor={cursor}
        approval={{
          message: "Chief of staff wants your yes before emailing 12 investors",
          onLater: () => undefined,
          onApprove: () => undefined,
        }}
      />
      <label className="flex items-center gap-3 rounded-full bg-bg-surface-80 px-4 py-2 text-caption text-text-secondary">
        Scrub the current line
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={cursor}
          onChange={(event) => setCursor(Number(event.target.value))}
          aria-label="Minutes before now"
        />
      </label>
    </Backdrop>
  );
}
