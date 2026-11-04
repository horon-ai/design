import { UsageMeter } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function UsageMeterDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop>
        <UsageMeter
          surface="glass"
          label="Usage this month"
          value={64}
          detail="6,420 of 10,000 tasks"
          note="Resets Nov 1"
        />
      </Backdrop>
      <div className="flex w-full flex-wrap items-center justify-center gap-4 rounded-2xl bg-bg-default p-4">
        <UsageMeter label="Usage this month" value={64} detail="6,420 of 10,000 tasks" note="Resets Nov 1" />
      </div>
    </div>
  );
}
