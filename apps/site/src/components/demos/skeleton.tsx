import { Skeleton } from "@horon-ai/react";

export default function SkeletonDemo() {
  return (
    <>
      <div className="flex w-80 flex-col gap-3 rounded-md border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="flex w-64 flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-52" />
      </div>
    </>
  );
}
