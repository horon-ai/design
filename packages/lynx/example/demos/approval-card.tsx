import { useState } from "@lynx-js/react";

import { ApprovalCard, type ApprovalState } from "../../src/components/approval-card";
import { Backdrop } from "./backdrop";

function InteractiveApproval() {
  const [state, setState] = useState<ApprovalState>("pending");
  return (
    <ApprovalCard
      state={state}
      title="Send the Q3 board deck to the team?"
      attachment="Q3 board deck v5"
      onApprove={() => setState("approved")}
      onLater={() => setState("declined")}
    />
  );
}

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex flex-row flex-wrap items-start justify-center gap-4">
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
    </view>
  );
}

/** The approval card in all three states, plus a live one the buttons settle. */
export default function ApprovalCardDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex flex-row flex-wrap items-start justify-center gap-4">
          <InteractiveApproval />
        </view>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
