import { UsageMeter } from "../../src/components/usage-meter";
import { Backdrop } from "./backdrop";

/** The same meter on both surfaces, so the frost fill and the solid card can be compared. */
export default function UsageMeterDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
          <UsageMeter
            surface="solid"
            label="Usage this month"
            value={64}
            detail="6,420 of 10,000 tasks"
            note="Resets Nov 1"
          />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop>
          <UsageMeter
            surface="glass"
            label="Usage this month"
            value={64}
            detail="6,420 of 10,000 tasks"
            note="Resets Nov 1"
          />
        </Backdrop>
      </view>
    </view>
  );
}
