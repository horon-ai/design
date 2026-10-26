import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskRow } from "@horon-ai/react";

const meta = {
  title: "Web/TaskRow",
  component: TaskRow,
  args: {
    status: "running",
    title: "Triage overnight email",
    elapsed: "1m 56s",
    bot: { initial: "C", name: "Chief of staff" },
    project: "Horon HQ",
    message: "Reading 41 new emails",
  },
} satisfies Meta<typeof TaskRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: (args) => (
    <div className="flex w-160 flex-col gap-3">
      <TaskRow {...args} />
      <TaskRow
        status="review"
        title="Draft replies to the investor thread"
        elapsed="6m 40s"
        bot={{ initial: "W", name: "Writer" }}
        project="Investor update"
        message="Ready for review"
        detail="2 drafts · 1 calendar change"
      />
      <TaskRow
        status="failed"
        title="Book interviews for next week"
        elapsed="3m 12s"
        bot={{ initial: "R", name: "Recruiter" }}
        project="Q4 hiring"
        message="Failed"
        detail="Google Calendar needs to be reconnected"
      />
      <TaskRow
        status="done"
        title="Send the Q3 board deck to the team"
        elapsed="9m"
        bot={{ initial: "C", name: "Chief of staff" }}
        project="Horon HQ"
        message="Sent"
        detail="Delivered to 4 people · 2 opened"
      />
    </div>
  ),
};
