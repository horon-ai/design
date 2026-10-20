import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@horon/web/components/input";
import { Label } from "@horon/web/components/label";

const meta = {
  title: "Web/Label",
  component: Label,
  parameters: { layout: "centered" },
  args: { children: "Label" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithControl: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" placeholder="Ada Lovelace" />
    </div>
  ),
};
