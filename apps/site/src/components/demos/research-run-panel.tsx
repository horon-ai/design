import { ResearchRunPanel } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const queries = [
  { id: "q1", text: "seed round AI agent startup Korea 2026", results: "16 results" },
  { id: "q2", text: "lead investor agent startup Seoul seed", results: "12 results" },
  { id: "q3", text: "Korean VC portfolio AI agents", results: "9 results" },
  { id: "q4", text: "seed investors AI automation Korea", results: "searching", state: "searching" as const },
];

export default function ResearchRunPanelDemo() {
  return (
    <Backdrop className="flex-col items-stretch">
      <ResearchRunPanel
        question="Which seed investors led AI agent rounds in Korea this year?"
        elapsed="12s"
        read={3}
        total={5}
        queries={queries}
        sources={["T", "P", "M", "V", "B"]}
      />
      <ResearchRunPanel
        running={false}
        question="Which blur radius keeps text legible on busy backgrounds?"
        queries={queries.slice(0, 3)}
      />
    </Backdrop>
  );
}
