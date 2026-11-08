import { useState } from "@lynx-js/react";

import { OrchestratorPanel } from "../../src/components/orchestrator-panel";
import { Icon } from "../../src/icons";

/**
 * A lane stand-in: `AgentLane` is still unported, so the demo paints the same
 * card shape inline. The orchestrator only ever sees its children.
 */
function Lane({
  initial,
  name,
  elapsed,
  task,
  output,
  failed,
}: {
  initial: string;
  name: string;
  elapsed: string;
  task: string;
  output: string;
  failed?: boolean;
}) {
  return (
    <view
      className={
        failed
          ? "flex flex-col gap-1 rounded-xl border border-border-danger bg-bg-surface px-3.5 py-3"
          : "flex flex-col gap-1 rounded-xl border border-border-default bg-bg-surface px-3.5 py-3"
      }
    >
      <view className="flex flex-row items-center gap-2">
        <view className="flex h-5 w-5 flex-row items-center justify-center rounded-md bg-overlay-ink-6">
          <text className="text-trim text-label-sm text-text-secondary">{initial}</text>
        </view>
        <text className="min-w-0 flex-1 text-label-md text-text-primary">{name}</text>
        <text className="shrink-0 text-caption text-text-secondary">{elapsed}</text>
      </view>
      <text className="text-body-sm text-text-secondary">{task}</text>
      <text className={failed ? "text-body-sm text-text-danger" : "text-body-sm text-text-primary"}>{output}</text>
    </view>
  );
}

/**
 * The parallel picker, a lead with its plan and lanes, and a Stop button that
 * flips the lead's status. Mirrors the site demo; `AgentLane` is drawn inline
 * until that slug is ported.
 */
export default function OrchestratorPanelDemo() {
  const [parallel, setParallel] = useState(3);
  const [stopped, setStopped] = useState(false);

  return (
    <view className="flex w-full max-w-[640px] flex-col gap-6 p-4">
      <OrchestratorPanel
        title="Prepare Monday's investor update"
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
        <Lane
          initial="R"
          name="Researcher"
          elapsed="1.9s"
          task="Portfolio metrics"
          output="Revenue up 18%, burn down to $210k a month"
        />
        <Lane
          initial="W"
          name="Writer"
          elapsed="3.4s"
          task="Draft the update email"
          output="Draft ready: 4 sections, 320 words"
        />
        <Lane
          initial="I"
          name="Inbox triage"
          elapsed="1.2s"
          task="Collect open investor questions"
          output="Gmail access expired. Reconnect to continue."
          failed
        />
      </OrchestratorPanel>
      <OrchestratorPanel
        title="Summarize the weekly standup"
        parallelOptions={[1, 2]}
        parallelValue={2}
        lead={{ initial: "C", name: "Chief of staff", running: true, status: "2 working", elapsed: "4s" }}
        plan={[{ label: "Read the standup notes", running: true }]}
      >
        <Lane initial="R" name="Researcher" elapsed="2.1s" task="Standup notes" output="Reading the doc…" />
      </OrchestratorPanel>
      <view className="flex flex-row items-center justify-center gap-2">
        <Icon name="UsersThree" size={16} color="text-secondary" />
        <text className="text-caption text-text-secondary">The lead fans out to one lane card per step.</text>
      </view>
    </view>
  );
}
