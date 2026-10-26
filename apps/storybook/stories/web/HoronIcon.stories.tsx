import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoronIcon } from "@horon-ai/react";

const meta = { title: "Web/HoronIcon", component: HoronIcon } satisfies Meta<typeof HoronIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-text-primary">
      <HoronIcon size={16} />
      <HoronIcon size={20} />
      <HoronIcon size={24} />
    </div>
  ),
};
