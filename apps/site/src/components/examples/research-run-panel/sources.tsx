import { ResearchRunPanel } from "@horon-ai/react";

const queries = [
  { id: "q1", text: "blur radius legibility text background", results: "11 results" },
  { id: "q2", text: "Apple material blur guidelines", results: "7 results" },
  { id: "q3", text: "contrast minimum overlay scrim", results: "9 results" },
];

export default function ResearchRunPanelSources() {
  return (
    <div className="flex w-full justify-center">
      <ResearchRunPanel
        question="Which blur radius keeps text legible on busy backgrounds?"
        running={false}
        elapsed="41s"
        read={5}
        total={5}
        queries={queries}
        sources={["T", "P", "M", "V", "B"]}
        onOpenSources={() => undefined}
      />
    </div>
  );
}
