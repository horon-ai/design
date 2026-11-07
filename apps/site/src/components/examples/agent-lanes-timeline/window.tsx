import { AgentLanesTimeline, type LaneBot } from "@horon-ai/react";
import { useState } from "react";

const bots: LaneBot[] = [
  {
    id: "researcher",
    name: "Researcher",
    initial: "R",
    tone: "sky",
    tasks: [
      { id: "ingest", label: "Ingest inbox", tone: "done", start: -58, end: -41 },
      { id: "digest", label: "Weekly digest", tone: "running", start: -26, end: -8 },
    ],
  },
  {
    id: "reviewer",
    name: "Reviewer",
    initial: "V",
    tone: "neutral",
    tasks: [{ id: "review", label: "Review digest", tone: "waiting", start: -8, end: 0 }],
  },
];

export default function AgentLanesTimelineWindow() {
  const [cursor, setCursor] = useState(6);
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <AgentLanesTimeline bots={bots} windowMinutes={60} cursor={cursor} onRangeClick={() => undefined} />
      <label className="flex items-center gap-3 text-caption text-text-secondary">
        Minutes before the window end
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={cursor}
          onChange={(event) => setCursor(Number(event.target.value))}
          aria-label="Minutes before the window end"
        />
      </label>
    </div>
  );
}
