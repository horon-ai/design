import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoronWordmark } from "@horon-ai/react";

const meta = { title: "Web/HoronWordmark", component: HoronWordmark } satisfies Meta<typeof HoronWordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 text-text-primary">
      <HoronWordmark />
      <HoronWordmark height={23} />
    </div>
  ),
};
