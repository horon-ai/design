import { Skeleton, SkeletonCard } from "../../src/components/skeleton";

/**
 * Row and Card placeholders on both surfaces, plus the plain text placeholder. The glass pair sits on a
 * subtle panel, which is what the site's `Backdrop` gives it there.
 */
export default function SkeletonDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
          <SkeletonCard surface="solid" type="row" />
          <SkeletonCard surface="solid" type="card" />
        </view>
      </view>

      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <view className="flex w-full flex-row flex-wrap gap-4 rounded-xl bg-bg-subtle p-4">
          <SkeletonCard surface="glass" type="row" />
          <SkeletonCard surface="glass" type="card" />
        </view>
      </view>

      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Text</text>
        <SkeletonCard surface="solid" type="text" />
      </view>

      <view className="flex flex-row items-center gap-3">
        <Skeleton shape="pill" className="size-9" />
        <view className="flex flex-col gap-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-2 w-32" />
        </view>
      </view>
    </view>
  );
}
