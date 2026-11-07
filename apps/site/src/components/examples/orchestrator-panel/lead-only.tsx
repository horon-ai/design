import { OrchestratorPanel } from "@horon-ai/react";

export default function OrchestratorPanelLeadOnly() {
  return (
    <OrchestratorPanel
      title="Write the weekly digest"
      lead={{ initial: "C", name: "Chief of staff", running: true, status: "Reading 12 threads", elapsed: "4s" }}
    />
  );
}
