import { AgentPanel, ComposerChip, TaskComposer, TaskRow } from "@horon-ai/react";
import { Folder } from "@phosphor-icons/react";

export default function AgentPanelDemo() {
  return (
    <AgentPanel className="max-w-168">
      <TaskComposer
        pickers={
          <>
            <ComposerChip leading="C">Chief of staff</ComposerChip>
            <ComposerChip leading={<Folder />}>Horon HQ</ComposerChip>
          </>
        }
      />
      <TaskRow
        status="running"
        title="Triage overnight email"
        elapsed="1m 56s"
        bot={{ initial: "C", name: "Chief of staff" }}
        project="Horon HQ"
        message="Reading 41 new emails"
      />
    </AgentPanel>
  );
}
