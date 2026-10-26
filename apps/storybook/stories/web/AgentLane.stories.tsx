import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentLane } from "@horon-ai/react";
import { EnvelopeSimple, FileText, MagnifyingGlass } from "@phosphor-icons/react";

const meta = {
  title: "Web/AgentLane",
  component: AgentLane,
  args: {
    status: "running",
    bot: { initial: "R", name: "Researcher" },
    elapsed: "1.9s",
    task: "Portfolio metrics",
    tool: { icon: <MagnifyingGlass />, label: "Notion · Q3 metrics dashboard" },
    output: "Revenue up 18%, burn down to $210k a month",
    usage: "2.6k tokens",
  },
} satisfies Meta<typeof AgentLane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: (args) => (
    <div className="flex w-140 flex-col gap-3">
      <AgentLane {...args} />
      <AgentLane
        status="done"
        bot={{ initial: "W", name: "Writer" }}
        elapsed="3.4s"
        task="Draft the update email"
        tool={{ icon: <FileText />, label: "Docs · Investor update template" }}
        output="Draft ready: 4 sections, 320 words"
        usage="4.9k tokens"
      />
      <AgentLane
        status="failed"
        bot={{ initial: "I", name: "Inbox triage" }}
        elapsed="1.2s"
        task="Collect open investor questions"
        tool={{ icon: <EnvelopeSimple />, label: "Gmail · investor threads, last 30 days" }}
        output="Gmail access expired. Reconnect to continue."
        usage="0.4k tokens"
      />
    </div>
  ),
};
