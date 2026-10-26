import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Textarea",
  component: Textarea,
  decorators: [onBackdrop],
  args: { placeholder: "Tell the bot what to do", className: "w-80" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Error: Story = { args: { invalid: true, defaultValue: "Draft replies in my voice." } };
export const Disabled: Story = { args: { disabled: true } };
