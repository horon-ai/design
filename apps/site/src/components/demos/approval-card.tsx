import { ApprovalCard } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ApprovalCardDemo() {
  return (
    <Backdrop>
      <ApprovalCard title="Send the Q3 board deck to the team?" attachment="Q3 board deck v5" />
      <ApprovalCard
        state="approved"
        status="Approved · sent 8:14 AM"
        title="Send the Q3 board deck to the team?"
        attachment="Q3 board deck v5"
      />
    </Backdrop>
  );
}
