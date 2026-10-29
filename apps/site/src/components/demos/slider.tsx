import { Slider } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function SliderDemo() {
  return (
    <Backdrop className="flex-col gap-6">
      <Slider defaultValue={50} aria-label="Speed" />
      <Slider defaultValue={20} aria-label="Volume" className="w-80" />
      <Slider defaultValue={70} disabled aria-label="Disabled" />
    </Backdrop>
  );
}
