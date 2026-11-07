import { AgentPanel, ComposerChip, TaskComposer } from "../../src/components/agent-panel";
import { FilterBar } from "../../src/components/filter-bar";
import { Icon } from "../../src/icons";
import { TaskRow } from "../../src/components/task-row";

/** The site demo: a filter bar, a task composer and two task rows inside the solid panel. */
export default function AgentPanelDemo() {
  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full max-w-[672px] flex-col">
        <AgentPanel
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
                <ComposerChip leading={<Icon name="Folder" size={14} color="text-secondary" />}>Horon HQ</ComposerChip>
              </>
            }
          />
          <view className="flex flex-col">
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
          </view>
        </AgentPanel>
      </view>
    </view>
  );
}
