import { SkeletonCard } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function SkeletonDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <SkeletonCard surface="solid" type="row" />
          <SkeletonCard surface="solid" type="card" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <SkeletonCard surface="glass" type="row" />
          <SkeletonCard surface="glass" type="card" />
        </Backdrop>
      </div>
    </div>
  );
}
