import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonCard } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Skeleton",
  component: Skeleton,
  decorators: [onBackdrop],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <SkeletonCard type="row" />
      <SkeletonCard type="card" />
      <SkeletonCard type="text" />
    </div>
  ),
};

export const Block: Story = { args: { className: "h-3 w-40" } };
