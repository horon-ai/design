import { ApprovalCard, type ApprovalState } from "@horon-ai/react";
import { useState } from "react";

export default function ApprovalCardInteractive() {
  const [state, setState] = useState<ApprovalState>("pending");
  return (
    <ApprovalCard
      state={state}
      title="File the invoice for 2,400 USD?"
      attachment="invoice-2291.pdf"
      onApprove={() => setState("approved")}
      onLater={() => setState("declined")}
    />
  );
}
