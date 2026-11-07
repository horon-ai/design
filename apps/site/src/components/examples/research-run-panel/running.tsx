import { ResearchRunPanel } from "@horon-ai/react";

export default function ResearchRunPanelRunning() {
  return (
    <div className="flex w-full justify-center">
      <ResearchRunPanel
        question="Which seed investors led AI agent rounds in Korea this year?"
        elapsed="12s"
        read={3}
        total={5}
        queries={[
          { id: "q1", text: "seed round AI agent startup Korea 2026", results: "16 results" },
          { id: "q2", text: "lead investor agent startup Seoul seed", results: "12 results" },
          { id: "q3", text: "Korean VC portfolio AI agents", results: "9 results" },
          { id: "q4", text: "seed investors AI automation Korea", state: "searching" },
        ]}
        onStop={() => undefined}
      />
    </div>
  );
}
