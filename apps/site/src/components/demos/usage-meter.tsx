import { UsageMeter } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function UsageMeterDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <UsageMeter
            surface="solid"
            label="Usage this month"
            value={64}
            detail="6,420 of 10,000 tasks"
            note="Resets Nov 1"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <UsageMeter
            surface="glass"
            label="Usage this month"
            value={64}
            detail="6,420 of 10,000 tasks"
            note="Resets Nov 1"
          />
        </Backdrop>
      </div>
    </div>
  );
}
