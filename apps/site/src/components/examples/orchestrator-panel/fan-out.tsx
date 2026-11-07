import { AgentLane, OrchestratorPanel } from "@horon-ai/react";
import { Envelope, FileText, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function OrchestratorPanelFanOut() {
  const [parallel, setParallel] = useState(3);
  return (
    <OrchestratorPanel
      title="Prepare Monday's investor update"
      parallelOptions={[1, 2, 3, 4]}
      parallelValue={parallel}
      onParallelChange={setParallel}
      onStop={() => undefined}
      lead={{ initial: "C", name: "Chief of staff", role: "Lead", running: true, status: "1 working", elapsed: "12s" }}
      plan={[
        { label: "Pull Q3 portfolio metrics from Notion", dotClassName: "bg-sky-400", running: true },
        { label: "Draft the update email", dotClassName: "bg-sky-600" },
        { label: "Collect open investor questions", dotClassName: "bg-sky-800" },
      ]}
      summary={{ count: "1 of 3 returned", body: "Chief of staff merges what the bots return here." }}
    >
      <AgentLane
        status="done"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Portfolio metrics"
        tool={{ icon: <MagnifyingGlass aria-hidden />, label: "Notion · Q3 metrics dashboard" }}
        output="Revenue up 18%, burn down to $210k a month"
        usage="2.6k tokens"
      />
      <AgentLane
        status="running"
        bot={{ initial: "W", name: "Writer" }}
        elapsed="3.4s"
        task="Draft the update email"
        tool={{ icon: <FileText aria-hidden />, label: "Docs · Investor update template" }}
      />
      <AgentLane
        status="failed"
        bot={{ initial: "I", name: "Inbox triage" }}
        elapsed="1.2s"
        task="Collect open investor questions"
        tool={{ icon: <Envelope aria-hidden />, label: "Gmail · investor threads, last 30 days" }}
        output="Gmail access expired. Reconnect to continue."
        usage="0.4k tokens"
      />
    </OrchestratorPanel>
  );
}
