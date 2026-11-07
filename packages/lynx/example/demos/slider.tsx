import { Slider } from "../../src/components/slider";

/** Three sliders on a card, the way a settings row reads: default, wider, disabled. */
export default function SliderDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-4 p-4">
      {/* On the page's own surface, as the other field demos: the 8% track is drawn for a card, not for a photo. */}
      <view className="flex w-full flex-col items-center gap-6 rounded-md border border-border-default bg-bg-surface px-6 py-8">
        <Slider defaultValue={50} aria-label="Speed" />
        <Slider defaultValue={20} aria-label="Volume" className="w-full max-w-80" />
        <Slider defaultValue={70} disabled aria-label="Disabled" />
      </view>
    </view>
  );
}
