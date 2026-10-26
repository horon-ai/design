import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Card",
  component: Card,
  decorators: [onBackdrop],
  args: {
    title: "Inbox Manager",
    description: "6 emails need you. Drafts are ready for review.",
    className: "w-80",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Interactive: Story = { args: { interactive: true, render: <button type="button" /> } };
export const Selected: Story = { args: { interactive: true, selected: true, render: <button type="button" /> } };
