import { useState } from "@lynx-js/react";

import { ResearchRunPanel, type ResearchQuery } from "../../src/components/research-run-panel";

const liveQueries: ResearchQuery[] = [
  { id: "q1", text: "seed round AI agent startup Korea 2026", results: "16 results" },
  { id: "q2", text: "lead investor agent startup Seoul seed", results: "12 results" },
  { id: "q3", text: "Korean VC portfolio AI agents", results: "9 results" },
  { id: "q4", text: "seed investors AI automation Korea", state: "searching" },
];

const doneQueries: ResearchQuery[] = [
  ...liveQueries.slice(0, 3),
  { id: "q4", text: "seed investors AI automation Korea", results: "11 results" },
  { id: "q5", text: "AI agent seed rounds 2026 Korea", results: "7 results" },
];

const questions = [
  "Which seed investors led AI agent rounds in Korea this year?",
  "Which blur radius keeps text legible on busy backgrounds?",
];

/** Stop ends the run: the status line folds away, the sources pill pops in and the button icon swaps to Send. */
function LiveRun() {
  const [run, setRun] = useState(0);
  const running = run === 0;
  return (
    <ResearchRunPanel
      question={questions[0]}
      running={running}
      elapsed={running ? "12s" : "41s"}
      read={running ? 3 : 5}
      total={5}
      queries={running ? liveQueries : doneQueries}
      sources={running ? undefined : ["T", "P", "M", "V", "B"]}
      onOpenSources={running ? undefined : () => undefined}
      onStop={() => setRun((value) => value + 1)}
      onNewResearch={() => setRun(0)}
    />
  );
}

export default function Demo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <LiveRun />
      <ResearchRunPanel running={false} question={questions[1]} queries={liveQueries.slice(0, 3)} />
    </view>
  );
}
