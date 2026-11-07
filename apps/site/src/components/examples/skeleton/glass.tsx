import { SkeletonCard } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function SkeletonGlass() {
  return (
    <Backdrop className="items-start">
      <SkeletonCard surface="glass" type="row" />
      <SkeletonCard surface="glass" type="card" />
    </Backdrop>
  );
}
