import { ApprovalCard } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <ApprovalCard surface={surface} title="Send the Q3 board deck to the team?" attachment="Q3 board deck v5" />
      <ApprovalCard
        surface={surface}
        state="approved"
        status="Approved · sent 8:14 AM"
        title="Send the Q3 board deck to the team?"
        attachment="Q3 board deck v5"
      />
      <ApprovalCard
        surface={surface}
        state="declined"
        status="Declined · yesterday"
        title="Send the Q3 board deck to the team?"
        attachment="Q3 board deck v5"
      />
    </div>
  );
}

export default function ApprovalCardDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
