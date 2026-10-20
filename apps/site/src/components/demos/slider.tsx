import { Slider, SliderIndicator, SliderThumb, SliderTrack, SliderValue } from "@horon-ai/react";

export default function SliderDemo() {
  return (
    <div className="flex w-72 flex-col gap-6">
      <Slider defaultValue={40}>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="볼륨" />
        </SliderTrack>
        <SliderValue />
      </Slider>
      <Slider defaultValue={[25, 75]}>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb index={0} aria-label="최솟값" />
          <SliderThumb index={1} aria-label="최댓값" />
        </SliderTrack>
        <SliderValue />
      </Slider>
      <Slider defaultValue={30} disabled>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="비활성" />
        </SliderTrack>
        <SliderValue />
      </Slider>
    </div>
  );
}
