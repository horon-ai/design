import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@horon-ai/react";

import { onBackdrop } from "../support";

const items = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage" },
];

const meta = {
  title: "Web/Select",
  component: Select,
  decorators: [onBackdrop],
  args: { items, placeholder: "Select a bot", "aria-label": "Bot" },
  argTypes: { surface: { control: "inline-radio", options: ["glass", "solid"] } },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Glass: Story = {};
export const Solid: Story = { args: { surface: "solid" } };
export const Filled: Story = { args: { defaultValue: "chief" } };
export const Error: Story = { args: { defaultValue: "chief", invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
