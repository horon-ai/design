import { Spinner } from "../../src/components/spinner";

/** The three named rungs, then the raw pixel sizes a row uses. */
export default function SpinnerDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-6 p-4">
      <view className="flex flex-row items-center gap-4">
        <Spinner size="xs" label="Loading extra small" />
        <Spinner size="sm" label="Loading small" />
        <Spinner size="md" label="Loading medium" />
        <Spinner size="lg" label="Loading large" />
      </view>
      <view className="flex flex-row items-center gap-4">
        <Spinner size={12} label="Loading 12" />
        <Spinner size={15} label="Loading 15" />
        <Spinner size={20} label="Loading 20" />
      </view>
      <view className="flex flex-row items-center gap-2">
        <Spinner size="sm" label="Saving" />
        <text className="text-label-md text-text-secondary">Saving</text>
      </view>
    </view>
  );
}
