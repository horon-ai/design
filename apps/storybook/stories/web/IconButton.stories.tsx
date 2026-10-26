import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/IconButton",
  component: IconButton,
  decorators: [onBackdrop],
  args: { icon: <Plus />, label: "Add", variant: "ghost", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "ghost", "glass"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["primary", "ghost", "glass"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <IconButton key={size} variant={variant} size={size} icon={<Plus />} label="Add" />
          ))}
          <IconButton variant={variant} icon={<Plus />} label="Add" disabled />
        </div>
      ))}
    </div>
  ),
};
