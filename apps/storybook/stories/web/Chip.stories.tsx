import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Chip",
  component: Chip,
  decorators: [onBackdrop],
  args: { children: "Inbox" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip>All</Chip>
      <Chip defaultPressed>Inbox</Chip>
      <Chip disabled>Archive</Chip>
      <Chip disabled defaultPressed>
        Starred
      </Chip>
    </div>
  ),
};
