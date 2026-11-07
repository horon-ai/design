import { Skeleton } from "@horon-ai/react";

export default function SkeletonBlocks() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-3">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-52" />
      <div className="flex items-center gap-3">
        <Skeleton shape="pill" className="size-9" />
        <Skeleton shape="pill" className="size-9" />
        <Skeleton shape="pill" className="h-8 w-24" />
      </div>
    </div>
  );
}
