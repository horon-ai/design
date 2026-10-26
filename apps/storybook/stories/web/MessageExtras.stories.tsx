import type { Meta, StoryObj } from "@storybook/react-vite";
import { Attachment, CodeBlock, DateSeparator, MessageActions } from "@horon-ai/react";
import { ArrowClockwise, Copy, DotsThree, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

const meta = { title: "Web/MessageExtras", component: MessageActions } satisfies Meta<typeof MessageActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  args: {
    actions: [
      { label: "Copy", icon: <Copy /> },
      { label: "Regenerate", icon: <ArrowClockwise /> },
      { label: "Good response", icon: <ThumbsUp /> },
      { label: "Bad response", icon: <ThumbsDown /> },
      { label: "More", icon: <DotsThree /> },
    ],
  },
  render: (args) => (
    <div className="flex w-90 flex-col gap-6">
      <MessageActions {...args} />
      <DateSeparator>Today</DateSeparator>
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => undefined} />
      <CodeBlock
        language="bash"
        code={"# send the weekly report\nhoron routine run weekly-report \\\n  --to alpoxdev@gmail.com"}
      />
    </div>
  ),
};
