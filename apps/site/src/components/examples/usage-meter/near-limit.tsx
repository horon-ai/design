import { UsageMeter } from "@horon-ai/react";

export default function UsageMeterNearLimit() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="max-w-75 text-body-sm text-text-secondary">
        9,200 of 10,000 tasks used. New tasks start counting again on Nov 1.
      </p>
      <UsageMeter label="Tasks used" value={92} detail="9,200 of 10,000 tasks" note="Resets Nov 1" />
    </div>
  );
}
