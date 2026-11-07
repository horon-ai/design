import { SkeletonCard } from "@horon-ai/react";

export default function SkeletonList() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <SkeletonCard type="row" />
      <SkeletonCard type="row" />
      <SkeletonCard type="row" />
    </div>
  );
}
