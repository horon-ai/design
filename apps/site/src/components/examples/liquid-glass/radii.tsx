import { LiquidGlass } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

const shapes = [
  { id: "20px", className: "rounded-xl" },
  { id: "16px", className: "rounded-2xl" },
  { id: "full", className: "rounded-full" },
] as const;

export default function LiquidGlassRadii() {
  return (
    <Backdrop>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`relative isolate flex h-28 w-40 items-center justify-center overflow-clip bg-glass-regular text-label-md text-text-primary ${shape.className}`}
        >
          <LiquidGlass />
          <span className="relative">{shape.id}</span>
        </div>
      ))}
    </Backdrop>
  );
}
