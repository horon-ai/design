import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "@horon-ai/react/components/toggle";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

const meta = {
  title: "Web/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
  args: { children: "Bold" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Bold" },
};

export const WithIcon: Story = {
  render: () => (
    <Toggle aria-label="Bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle>Default</Toggle>
      <Toggle variant="outline">Outline</Toggle>
      <Toggle defaultPressed>Pressed</Toggle>
      <Toggle disabled>Disabled</Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle size="default" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle size="lg" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </div>
  ),
};
