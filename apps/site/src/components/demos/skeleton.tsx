import { SkeletonCard } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function SkeletonDemo() {
  return (
    <Backdrop>
      <SkeletonCard type="row" />
      <SkeletonCard type="card" />
    </Backdrop>
  );
}
