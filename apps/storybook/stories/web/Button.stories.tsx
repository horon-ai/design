import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Button",
  component: Button,
  decorators: [onBackdrop],
  args: { children: "Button", variant: "primary", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "glass", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["primary", "glass", "danger"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} variant={variant} size={size} icon={<Plus />}>
              New bot
            </Button>
          ))}
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </div>
      ))}
    </div>
  ),
};
