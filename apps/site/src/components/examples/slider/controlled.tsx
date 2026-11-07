import { Slider } from "@horon-ai/react";
import { useState } from "react";

export default function SliderControlled() {
  const [speed, setSpeed] = useState(1);

  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-md border border-border-default bg-bg-surface px-6 py-8">
      <div className="flex w-full max-w-80 flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-caption text-text-secondary">Voice speed</span>
          <span className="text-label-md text-text-primary tabular-nums">{speed.toFixed(1)}×</span>
        </div>
        <Slider
          aria-label="Voice speed"
          min={0.5}
          max={2}
          step={0.1}
          value={speed}
          onValueChange={(next) => {
            if (typeof next === "number") setSpeed(next);
          }}
          className="w-full max-w-80"
        />
      </div>
    </div>
  );
}
