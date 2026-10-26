import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "@horon-ai/react";

const meta = { title: "Web/ChatBubble", component: ChatBubble } satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Conversation: Story = {
  render: () => (
    <div className="flex w-120 flex-col gap-3">
      <ChatBubble from="me">What needs my attention today?</ChatBubble>
      <ChatBubble from="bot" className="w-78">
        Overnight: 41 new emails, 6 need you. The rest are filed.
      </ChatBubble>
    </div>
  ),
};
