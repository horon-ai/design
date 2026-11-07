import { Badge } from "@horon-ai/react";

const tones = [
  { tone: "neutral", label: "Draft" },
  { tone: "brand", label: "Running" },
  { tone: "danger", label: "Failed" },
  { tone: "solid", label: "New" },
  { tone: "surface", label: "Ready" },
] as const;

export default function BadgeTones() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {tones.map(({ tone, label }) => (
        <Badge key={tone} tone={tone}>
          {label}
        </Badge>
      ))}
    </div>
  );
}
