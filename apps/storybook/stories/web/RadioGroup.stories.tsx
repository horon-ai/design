import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "@horon/web/components/radio-group";
import { Label } from "@horon/web/components/label";

const meta = {
  title: "Web/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" className="w-64">
      <Label>
        <RadioGroupItem value="standard" /> Standard
      </Label>
      <Label>
        <RadioGroupItem value="express" /> Express
      </Label>
      <Label>
        <RadioGroupItem value="overnight" /> Overnight
      </Label>
    </RadioGroup>
  ),
};

export const States: Story = {
  render: () => (
    <RadioGroup defaultValue="a" className="w-64">
      <Label>
        <RadioGroupItem value="a" /> Selected
      </Label>
      <Label>
        <RadioGroupItem value="b" /> Unselected
      </Label>
      <Label className="opacity-50">
        <RadioGroupItem value="c" disabled /> Disabled
      </Label>
    </RadioGroup>
  ),
};
