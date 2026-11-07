import { Badge } from "@horon-ai/react";

const agents = [
  { name: "Inbox Manager", meta: "6 emails need you", tone: "brand", label: "Running" },
  { name: "Weekly digest", meta: "Every Monday, 09:00", tone: "neutral", label: "Queued" },
  { name: "Invoice parser", meta: "Last run failed", tone: "danger", label: "Failed" },
] as const;

export default function BadgeInContext() {
  return (
    <div className="flex w-full max-w-96 flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-title-sm text-text-primary">Your agents</h3>
        <Badge tone="solid">New</Badge>
      </div>
      <ul className="flex flex-col divide-y divide-border-default rounded-xl border border-border-default bg-bg-surface">
        {agents.map((agent) => (
          <li key={agent.name} className="flex items-center gap-3 px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label-lg text-text-primary">{agent.name}</span>
              <span className="block truncate text-caption text-text-secondary">{agent.meta}</span>
            </span>
            <Badge tone={agent.tone} dot>
              {agent.label}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
