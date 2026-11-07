import { ApprovalCard } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function ApprovalCardGlass() {
  return (
    <Backdrop>
      <ApprovalCard
        surface="glass"
        title="Send the recap to everyone in the channel?"
        attachment="weekly-recap.md"
        onApprove={() => undefined}
        onLater={() => undefined}
      />
    </Backdrop>
  );
}
