import type { Meta, StoryObj } from "@storybook/react-vite";
import { UsageMeter } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/UsageMeter",
  component: UsageMeter,
  decorators: [onBackdrop],
  args: { label: "Usage this month", value: 64, detail: "6,420 of 10,000 tasks", note: "Resets Nov 1" },
} satisfies Meta<typeof UsageMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
