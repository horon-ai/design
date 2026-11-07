import { useState } from "@lynx-js/react";

import { Slider } from "../../src/components/slider";

/** One vertical slider with its own percent readout, so a drag is visible as a number. */
function VerticalSlider({ label, disabled = false }: { label: string; disabled?: boolean }) {
  const [level, setLevel] = useState(65);
  return (
    <view className="flex flex-col items-center gap-2">
      <Slider
        aria-label={label}
        orientation="vertical"
        value={level}
        disabled={disabled}
        onValueChange={setLevel}
      />
      <text className="text-caption tabular-nums text-text-secondary">
        {`${level}%`}
      </text>
    </view>
  );
}

/** Three sliders on a card, the way a settings row reads: default, wider, disabled; then the vertical axis. */
export default function SliderDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-4 p-4">
      {/* On the page's own surface, as the other field demos: the 8% track is drawn for a card, not for a photo. */}
      <view className="flex w-full flex-col items-center gap-6 rounded-md border border-border-default bg-bg-surface px-6 py-8">
        <Slider defaultValue={50} aria-label="Speed" />
        <Slider defaultValue={20} aria-label="Volume" className="w-full max-w-80" />
        <Slider defaultValue={70} disabled aria-label="Disabled" />
        <view className="flex flex-row items-end gap-8 pt-2">
          <VerticalSlider label="Pitch" />
          <VerticalSlider label="Vertical disabled" disabled />
        </view>
      </view>
    </view>
  );
}
