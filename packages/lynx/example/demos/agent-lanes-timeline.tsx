import { useState } from "@lynx-js/react";

import { AgentLanesTimeline, type LaneBot } from "../../src/components/agent-lanes-timeline";
import { Icon } from "../../src/icons";

const bots: LaneBot[] = [
  {
    id: "researcher",
    name: "Researcher",
    tools: "Notion · Gmail",
    initial: "R",
    tone: "sky",
    tasks: [
      {
        id: "portfolio",
        label: "Portfolio metrics",
        icon: <Icon name="Folder" size={14} color="text-secondary" />,
        tone: "done",
        start: -28,
        end: -16,
      },
      {
        id: "questions",
        label: "Investor questions",
        icon: <Icon name="Envelope" size={14} color="text-secondary" />,
        tone: "running",
        start: -9,
        end: 0,
      },
    ],
  },
  {
    id: "writer",
    name: "Writer",
    tools: "Docs",
    initial: "W",
    tone: "steel",
    tasks: [
      {
        id: "update",
        label: "Draft investor update",
        icon: <Icon name="FileText" size={14} color="text-secondary" />,
        tone: "running",
        start: -14,
        end: 0,
      },
    ],
  },
  {
    id: "reviewer",
    name: "Reviewer",
    tools: "Docs",
    initial: "V",
    tone: "neutral",
    badge: "Idle",
    tasks: [
      {
        id: "deck",
        label: "Review Q3 deck",
        icon: <Icon name="FileText" size={14} color="text-secondary" />,
        tone: "done",
        start: -30,
        end: -19,
      },
    ],
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
      {
        id: "interviews",
        label: "Book interviews",
        icon: <Icon name="WarningCircle" size={14} color="text-danger" />,
        tone: "failed",
        start: -28,
        end: -21,
      },
      {
        id: "send",
        label: "Send to 12 investors",
        icon: <Icon name="Envelope" size={14} color="text-secondary" />,
        tone: "waiting",
        start: -12,
        end: 0,
        badge: (
          <view className="flex flex-row items-center gap-1">
            <Icon name="Warning" size={12} color="text-inverse" />
            <text className="text-label-sm text-text-inverse">Needs you</text>
          </view>
        ),
      },
    ],
  },
];

/** The site demo, with the cursor scrubbed by the four range buttons instead of a slider. */
export default function AgentLanesTimelineDemo() {
  const [cursor, setCursor] = useState(0);
  return (
    <view className="flex w-full flex-col items-center gap-6 p-4">
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
      <view className="flex flex-row flex-wrap items-center gap-2 rounded-full bg-bg-surface-80 px-4 py-2">
        <text className="text-caption text-text-secondary">Scrub the current line</text>
        {[0, 4, 7, 10].map((minute) => (
          <view
            key={minute}
            className={
              minute === cursor
                ? "flex h-6 flex-row items-center rounded-full bg-interactive-primary px-2.5"
                : "flex h-6 flex-row items-center rounded-full bg-overlay-ink-6 px-2.5"
            }
            bindtap={() => setCursor(minute)}
            accessibility-element
            accessibility-traits="button"
            accessibility-label={`${minute} minutes before now`}
          >
            <text className={minute === cursor ? "text-caption text-text-inverse" : "text-caption text-text-primary"}>
              {`-${minute}m`}
            </text>
          </view>
        ))}
      </view>
    </view>
  );
}
