import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentPanel, ComposerChip, SegmentedControl, TaskComposer, TaskRow } from "@horon-ai/react";
import { Folder } from "@phosphor-icons/react";

const meta = { title: "Web/AgentPanel", component: AgentPanel } satisfies Meta<typeof AgentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const count = (label: string, value: number) => (
  <span className="flex items-center gap-1.5">
    {label}
    <span className="text-caption text-text-secondary">{value}</span>
  </span>
);

export const AgentTasks: Story = {
  render: () => (
    <AgentPanel className="w-168">
      <TaskComposer
        pickers={
          <>
            <ComposerChip leading="C">Chief of staff</ComposerChip>
            <ComposerChip leading={<Folder />}>Horon HQ</ComposerChip>
          </>
        }
      />
      <SegmentedControl
        aria-label="Status"
        size="sm"
        surface="inset"
        className="w-fit"
        defaultValue="all"
        items={[
          { value: "all", label: count("All", 4) },
          { value: "running", label: count("Running", 1) },
          { value: "review", label: count("Review", 1) },
          { value: "done", label: count("Done", 2) },
        ]}
      />
      <TaskRow
        status="running"
        title="Triage overnight email"
        elapsed="1m 56s"
        bot={{ initial: "C", name: "Chief of staff" }}
        project="Horon HQ"
        message="Reading 41 new emails"
      />
      <TaskRow
        status="review"
        title="Draft replies to the investor thread"
        elapsed="6m 40s"
        bot={{ initial: "W", name: "Writer" }}
        project="Investor update"
        message="Ready for review"
        detail="2 drafts · 1 calendar change"
      />
    </AgentPanel>
  ),
};
