import { AgentPanel, ComposerChip, FilterBar, TaskComposer, TaskRow } from "@horon-ai/react";
import { Folder } from "@phosphor-icons/react";

export default function AgentPanelDemo() {
  return (
    <AgentPanel
      className="max-w-168"
      filter={
        <FilterBar
          items={[
            { value: "all", label: "All", count: 2 },
            { value: "running", label: "Running", count: 1 },
            { value: "done", label: "Done", count: 1 },
          ]}
        />
      }
    >
      <TaskComposer
        pickers={
          <>
            <ComposerChip leading="C">Chief of staff</ComposerChip>
            <ComposerChip leading={<Folder />}>Horon HQ</ComposerChip>
          </>
        }
      />
      <div className="flex flex-col">
        <TaskRow
          variant="list"
          status="running"
          title="Triage overnight email"
          elapsed="1m 56s"
          bot={{ initial: "C", name: "Chief of staff" }}
          project="Horon HQ"
          message="Reading 41 new emails"
        />
        <TaskRow
          variant="list"
          status="done"
          title="Draft weekly summary"
          elapsed="3m 12s"
          bot={{ initial: "C", name: "Chief of staff" }}
          project="Horon HQ"
          message="Summary ready"
        />
      </div>
    </AgentPanel>
  );
}
