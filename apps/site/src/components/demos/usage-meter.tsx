import { UsageMeter } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function UsageMeterDemo() {
  return (
    <Backdrop>
      <UsageMeter label="Usage this month" value={64} detail="6,420 of 10,000 tasks" note="Resets Nov 1" />
    </Backdrop>
  );
}
