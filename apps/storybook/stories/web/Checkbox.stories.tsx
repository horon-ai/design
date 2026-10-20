import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@horon-ai/react/components/checkbox";
import { Label } from "@horon-ai/react/components/label";

const meta = {
  title: "Web/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  args: { disabled: false },
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox /> Unchecked
      </Label>
      <Label>
        <Checkbox defaultChecked /> Checked
      </Label>
      <Label>
        <Checkbox indeterminate /> Indeterminate
      </Label>
      <Label className="opacity-50">
        <Checkbox disabled /> Disabled unchecked
      </Label>
      <Label className="opacity-50">
        <Checkbox disabled defaultChecked /> Disabled checked
      </Label>
    </div>
  ),
};
