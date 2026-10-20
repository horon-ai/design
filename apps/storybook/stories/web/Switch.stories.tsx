import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@horon/web/components/switch";
import { Label } from "@horon/web/components/label";

const meta = {
  title: "Web/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  args: { size: "default", disabled: false },
  argTypes: {
    size: { control: "select", options: ["sm", "default"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultChecked: true } };

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label>
        <Switch defaultChecked /> On
      </Label>
      <Label>
        <Switch /> Off
      </Label>
      <Label>
        <Switch size="sm" defaultChecked /> Small
      </Label>
      <Label className="opacity-50">
        <Switch disabled /> Disabled
      </Label>
    </div>
  ),
};
