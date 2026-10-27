import { AgentLane, OrchestratorPanel } from "@horon-ai/react";
import { Envelope, FileText, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function OrchestratorPanelDemo() {
  const [parallel, setParallel] = useState(3);
  const [stopped, setStopped] = useState(false);

  return (
    <div className="flex w-full max-w-160 flex-col gap-6">
      <OrchestratorPanel
        title="Prepare Monday’s investor update"
        parallelOptions={[1, 2, 3, 4]}
        parallelValue={parallel}
        onParallelChange={setParallel}
        onStop={() => setStopped((value) => !value)}
        stopLabel={stopped ? "Stopped" : "Stop"}
        lead={{
          initial: "C",
          name: "Chief of staff",
          role: "Lead",
          running: !stopped,
          status: stopped ? "Stopped" : "1 working",
          elapsed: "12s",
        }}
        plan={[
          { label: "Pull Q3 portfolio metrics from Notion", dotClassName: "bg-sky-400", running: !stopped },
          { label: "Draft the update email", dotClassName: "bg-sky-600" },
          { label: "Collect open investor questions", dotClassName: "bg-sky-800" },
        ]}
        summary={{
          count: "1 of 3 returned",
          body: "Chief of staff merges what the bots return here.",
        }}
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
          status="done"
          bot={{ initial: "W", name: "Writer" }}
          elapsed="3.4s"
          task="Draft the update email"
          tool={{ icon: <FileText aria-hidden />, label: "Docs · Investor update template" }}
          output="Draft ready: 4 sections, 320 words"
          usage="4.9k tokens"
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
      <OrchestratorPanel
        title="Summarize the weekly standup"
        parallelOptions={[1, 2]}
        parallelValue={2}
        lead={{ initial: "C", name: "Chief of staff", running: true, status: "2 working", elapsed: "4s" }}
        plan={[{ label: "Read the standup notes", running: true }]}
      >
        <AgentLane
          status="running"
          bot={{ initial: "R", name: "Researcher" }}
          elapsed="2.1s"
          task="Standup notes"
          tool={{ icon: <FileText aria-hidden />, label: "Docs · Weekly standup" }}
        />
      </OrchestratorPanel>
    </div>
  );
}
