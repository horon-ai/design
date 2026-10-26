import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlanStep } from "@horon-ai/react";

const meta = {
  title: "Web/PlanStep",
  component: PlanStep,
  args: {
    status: "done",
    index: 1,
    title: "Pull Q3 revenue and ARR",
    description: "Monthly revenue, ARR and net retention",
    tool: "stripe.query",
    elapsed: "1.3s",
  },
} satisfies Meta<typeof PlanStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plan: Story = {
  render: (args) => (
    <div className="flex w-140 flex-col">
      <PlanStep {...args} />
      <PlanStep {...args} status="running" index={2} elapsed="0.4s" />
      <PlanStep {...args} status="failed" index={3} error="Slides API timed out after 30s" onRetry={() => undefined} />
      <PlanStep
        status="pending"
        index={5}
        title="Send the draft to Maya for review"
        description="Draft for review in Gmail"
        tool="gmail.draft"
        last
      />
    </div>
  ),
};
