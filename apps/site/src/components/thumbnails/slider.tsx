import { Slider } from "@horon-ai/react";

export default function SliderThumbnail() {
  return (
    <div className="flex w-72 flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-label-md text-text-primary">Volume</span>
        <span className="text-label-md text-text-secondary">60</span>
      </div>
      {/* `edge` is what makes Base UI paint the thumb without hydration: it emits the
          prehydration script that positions the fill and the thumb at 60%. */}
      <Slider aria-label="Volume" defaultValue={60} thumbAlignment="edge" className="w-full" />
    </div>
  );
}
