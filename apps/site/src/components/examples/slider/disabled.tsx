import { Slider } from "@horon-ai/react";

export default function SliderDisabled() {
  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-md border border-border-default bg-bg-surface px-6 py-8">
      <Slider aria-label="Volume" defaultValue={70} />
      <Slider aria-label="Volume, locked by policy" defaultValue={70} disabled />
    </div>
  );
}
