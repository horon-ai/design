import { UsageMeter } from "@horon-ai/react";

export default function UsageMeterUsage() {
  return (
    <UsageMeter
      label="Tasks used"
      value={64}
      detail="6,420 of 10,000 tasks"
      note="Resets Nov 1"
    />
  );
}
