import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@horon-ai/react/components/spinner";

const meta = {
  title: "Web/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
    </div>
  ),
};
