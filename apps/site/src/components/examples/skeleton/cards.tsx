import { SkeletonCard } from "@horon-ai/react";

export default function SkeletonCards() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-4">
      <div className="flex w-full max-w-75 flex-col items-center gap-2">
        <SkeletonCard type="row" />
        <span className="text-caption text-text-secondary">row</span>
      </div>
      <div className="flex w-full max-w-70 flex-col items-center gap-2">
        <SkeletonCard type="card" />
        <span className="text-caption text-text-secondary">card</span>
      </div>
      <div className="flex w-full max-w-70 flex-col items-center gap-2">
        <SkeletonCard type="text" />
        <span className="text-caption text-text-secondary">text</span>
      </div>
    </div>
  );
}
