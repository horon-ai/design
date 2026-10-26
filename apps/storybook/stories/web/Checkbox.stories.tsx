import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@horon-ai/react";

const meta = {
  title: "Web/Checkbox",
  component: Checkbox,
  args: { label: "Email me a daily summary" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Off" />
      <Checkbox label="On" defaultChecked />
      <Checkbox label="Mixed" indeterminate />
      <Checkbox label="Disabled" disabled defaultChecked />
    </div>
  ),
};
