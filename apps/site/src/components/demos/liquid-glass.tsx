import { LiquidGlass } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function LiquidGlassDemo() {
  return (
    <Backdrop>
      {(["clear", "regular", "thick"] as const).map((tier) => (
        <div
          key={tier}
          className={`relative flex h-28 w-40 items-center justify-center overflow-clip rounded-xl border border-glass-rim-strong text-label-md text-text-primary ${
            tier === "clear" ? "bg-glass-clear" : tier === "regular" ? "bg-glass-regular" : "bg-glass-thick"
          }`}
        >
          <LiquidGlass tier={tier} />
          <span className="relative">{tier}</span>
        </div>
      ))}
    </Backdrop>
  );
}
