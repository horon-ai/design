import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@horon-ai/react";

const meta = { title: "Web/Spinner", component: Spinner } satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
