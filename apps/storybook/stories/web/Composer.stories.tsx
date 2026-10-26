import type { Meta, StoryObj } from "@storybook/react-vite";
import { Composer } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Composer",
  component: Composer,
  decorators: [onBackdrop],
  args: { placeholder: "Ask Chief of staff", className: "w-97.5" },
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Typing: Story = { args: { defaultValue: "Add a slide for headcount" } };
