import type { Meta, StoryObj } from "@storybook/react-vite";
import { JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/ChatControls",
  component: VoiceInput,
  decorators: [onBackdrop],
  args: { elapsed: "0:07" },
} satisfies Meta<typeof VoiceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: (args) => (
    <div className="flex items-start gap-8">
      <JumpToLatest />
      <NewMessagesPill>3 new messages</NewMessagesPill>
      <VoiceInput {...args} />
    </div>
  ),
};
