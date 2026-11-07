import { Badge } from "@horon-ai/react";

const states = [
  { tone: "brand", label: "Running" },
  { tone: "neutral", label: "Queued" },
  { tone: "danger", label: "Failed" },
] as const;

export default function BadgeWithDot() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {states.map(({ tone, label }) => (
          <Badge key={label} tone={tone} dot>
            {label}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {states.map(({ tone, label }) => (
          <Badge key={label} tone={tone}>
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
