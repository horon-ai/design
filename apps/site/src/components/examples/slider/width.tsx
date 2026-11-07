import { Slider } from "@horon-ai/react";

export default function SliderWidth() {
  return (
    <div className="flex w-full flex-col items-center gap-8 rounded-md border border-border-default bg-bg-surface px-6 py-8">
      <div className="flex w-full flex-col items-center gap-2">
        <Slider aria-label="Volume, default width" defaultValue={20} />
        <span className="text-caption text-text-secondary">Default 220px</span>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <Slider aria-label="Volume, full width" defaultValue={60} className="w-full max-w-96" />
        <span className="text-caption text-text-secondary">className="w-full max-w-96"</span>
      </div>
    </div>
  );
}
