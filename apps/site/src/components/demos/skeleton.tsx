import { SkeletonCard } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function SkeletonDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop>
        <SkeletonCard surface="glass" type="row" />
        <SkeletonCard surface="glass" type="card" />
      </Backdrop>
      <div className="flex w-full flex-wrap items-center justify-center gap-4 rounded-2xl bg-bg-default p-4">
        <SkeletonCard type="row" />
        <SkeletonCard type="card" />
      </div>
    </div>
  );
}
