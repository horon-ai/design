import { Badge, type BadgeTone } from "../../src/components/badge";

const tones: { tone: BadgeTone; label: string }[] = [
  { tone: "neutral", label: "Draft" },
  { tone: "surface", label: "Ready" },
  { tone: "brand", label: "ON" },
  { tone: "danger", label: "Failed" },
  { tone: "solid", label: "New" },
];

/** Every tone in every rung; the solid pill is the only one without a status dot. */
export default function BadgeDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-3 p-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <view key={size} className="flex flex-row flex-wrap items-center justify-center gap-2">
          {tones.map(({ tone, label }) => (
            <Badge key={tone} size={size} tone={tone} dot={tone !== "solid"}>
              {label}
            </Badge>
          ))}
        </view>
      ))}
    </view>
  );
}
