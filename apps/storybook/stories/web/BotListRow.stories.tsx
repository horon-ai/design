import type { Meta, StoryObj } from "@storybook/react-vite";
import { BotListRow } from "@horon-ai/react";

const meta = {
  title: "Web/BotListRow",
  component: BotListRow,
  args: { name: "Sales Outbound", time: "8:41 AM", preview: "Outreach drafts queued for approval.", live: true },
} satisfies Meta<typeof BotListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: (args) => (
    <div className="flex w-90 flex-col gap-1">
      <BotListRow {...args} />
      <BotListRow {...args} selected />
      <BotListRow {...args} live={false} preview="Paused. Turn on to resume outreach." />
    </div>
  ),
};
