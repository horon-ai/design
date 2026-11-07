import { AgentLane, OrchestratorPanel } from "@horon-ai/react";
import { Envelope, FileText } from "@phosphor-icons/react";
import { useState } from "react";

export default function OrchestratorPanelStopped() {
  const [stopped, setStopped] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <OrchestratorPanel
        title="Summarize the weekly standup"
        parallelOptions={[1, 2]}
        parallelValue={2}
        onStop={() => setStopped((value) => !value)}
        stopLabel={stopped ? "Stopped" : "Stop"}
        lead={{
          initial: "C",
          name: "Chief of staff",
          running: !stopped,
          status: stopped ? "Stopped" : "2 working",
          elapsed: stopped ? "8s" : "4s",
        }}
        plan={[{ label: "Read the standup notes", running: !stopped }]}
      >
        <AgentLane
          status="done"
          bot={{ initial: "R", name: "Researcher" }}
          elapsed="2.1s"
          task="Standup notes"
          tool={{ icon: <FileText aria-hidden />, label: "Docs · Weekly standup" }}
        />
        <AgentLane
          status={stopped ? "failed" : "running"}
          bot={{ initial: "I", name: "Inbox triage" }}
          elapsed="1.2s"
          task="Collect blockers from threads"
          tool={{ icon: <Envelope aria-hidden />, label: "Gmail · standup threads" }}
          output={stopped ? "Stopped by you before it finished." : undefined}
        />
      </OrchestratorPanel>
    </div>
  );
}
