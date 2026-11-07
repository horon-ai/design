import { UsageMeter } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function UsageMeterSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <UsageMeter
        surface="solid"
        label="Tasks used"
        value={64}
        detail="6,420 of 10,000 tasks"
        note="Resets Nov 1"
      />
      <Backdrop>
        <UsageMeter
          surface="glass"
          label="Tasks used"
          value={64}
          detail="6,420 of 10,000 tasks"
          note="Resets Nov 1"
        />
      </Backdrop>
    </div>
  );
}
