import { LiquidGlass } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

const tiers = [
  { id: "clear", className: "bg-glass-clear" },
  { id: "regular", className: "bg-glass-regular" },
  { id: "thick", className: "bg-glass-thick" },
] as const;

export default function LiquidGlassTiers() {
  return (
    <Backdrop>
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={`relative isolate flex h-28 w-40 items-center justify-center overflow-clip rounded-xl text-label-md text-text-primary ${tier.className}`}
        >
          <LiquidGlass />
          <span className="relative">{tier.id}</span>
        </div>
      ))}
    </Backdrop>
  );
}
