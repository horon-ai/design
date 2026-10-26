import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "@horon-ai/react";

const meta = {
  title: "Web/Progress",
  component: Progress,
  args: { value: 40, "aria-label": "Upload" },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Values: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress value={0} aria-label="Not started" />
      <Progress value={40} aria-label="In progress" />
      <Progress value={100} aria-label="Done" />
    </div>
  ),
};
