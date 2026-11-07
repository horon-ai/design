import { LiquidGlass } from "../../src/components/liquid-glass";

/**
 * The three glass tiers side by side. On Lynx each tier resolves to the
 * frost-safe fill, so the three read the same by design and the rim layer is the
 * part that carries the material.
 */
export default function LiquidGlassDemo() {
  return (
    <view className="flex flex-row flex-wrap gap-3 p-4">
      {(["clear", "regular", "thick"] as const).map((tier) => (
        <view
          key={tier}
          className={`relative flex h-28 w-40 items-center justify-center overflow-hidden rounded-xl ${
            tier === "clear" ? "bg-glass-clear" : tier === "regular" ? "bg-glass-regular" : "bg-glass-thick"
          }`}
        >
          <LiquidGlass />
          <text className="text-label-md text-text-primary">{tier}</text>
        </view>
      ))}
    </view>
  );
}
