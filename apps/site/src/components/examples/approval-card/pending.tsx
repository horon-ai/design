import { ApprovalCard } from "@horon-ai/react";

export default function ApprovalCardPending() {
  return (
    <ApprovalCard
      title="Send the Q3 board deck to the team?"
      attachment="Q3 board deck v5"
      onApprove={() => undefined}
      onLater={() => undefined}
    />
  );
}
