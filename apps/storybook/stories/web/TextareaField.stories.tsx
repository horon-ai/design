import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaField } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/TextareaField",
  component: TextareaField,
  decorators: [onBackdrop],
  args: {
    label: "Instructions",
    hint: "Optional",
    placeholder: "Tell the bot how you like your inbox handled",
    description: "The bot reads this before every task.",
    maxLength: 280,
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = {
  args: { defaultValue: "Draft replies in my voice. Never send without asking. Flag anything from the board." },
};
export const Error: Story = { args: { error: "Keep it under 280 characters." } };
export const Disabled: Story = { args: { disabled: true } };
