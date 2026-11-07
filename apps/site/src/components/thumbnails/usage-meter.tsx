import { UsageMeter } from "@horon-ai/react";

export default function UsageMeterThumbnail() {
  return (
    <UsageMeter
      label="Usage this month"
      value={64}
      detail="6,420 of 10,000 tasks"
      note="Resets Nov 1"
    />
  );
}
