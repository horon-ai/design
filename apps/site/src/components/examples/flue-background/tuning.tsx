import { FlueBackground } from "@horon-ai/react";

export default function FlueBackgroundTuning() {
  return (
    <div className="relative isolate min-h-96 w-full overflow-hidden rounded-xl border border-border-default bg-bg-default">
      <FlueBackground config={{ speed: 0.6, cursor: 1, maxDpr: 2 }} />
      <div className="relative flex flex-col gap-2 p-8 text-text-primary">
        <p className="text-label-lg font-semibold">Faster plume, real pointer</p>
        <p className="max-w-90 text-body-sm text-text-secondary">
          speed scrolls the drift faster, cursor 1 hands the plume the real pointer, and maxDpr 2 sharpens the
          fill on a dense display.
        </p>
      </div>
    </div>
  );
}
