import { ApprovalCard } from "@horon-ai/react";

export default function ApprovalCardStates() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <ApprovalCard title="Send the Q3 board deck to the team?" attachment="Q3 board deck v5" />
      <ApprovalCard
        state="approved"
        status="Approved · sent 8:14 AM"
        title="Send the Q3 board deck to the team?"
        attachment="Q3 board deck v5"
      />
      <ApprovalCard
        state="declined"
        status="Declined · yesterday"
        title="Send the Q3 board deck to the team?"
        attachment="Q3 board deck v5"
      />
    </div>
  );
}
