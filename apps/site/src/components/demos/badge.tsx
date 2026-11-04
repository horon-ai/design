import { Badge, type BadgeTone } from "@horon-ai/react";

const tones: { tone: BadgeTone; label: string }[] = [
  { tone: "neutral", label: "Draft" },
  { tone: "surface", label: "Ready" },
  { tone: "brand", label: "ON" },
  { tone: "danger", label: "Failed" },
  { tone: "solid", label: "New" },
];

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center justify-center gap-2">
          {tones.map(({ tone, label }) => (
            <Badge key={tone} size={size} tone={tone} dot={tone !== "solid"}>
              {label}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}
