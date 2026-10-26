import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApprovalCard } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/ApprovalCard",
  component: ApprovalCard,
  decorators: [onBackdrop],
  args: { title: "Send the Q3 board deck to the team?", attachment: "Q3 board deck v5" },
} satisfies Meta<typeof ApprovalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {};
export const Approved: Story = { args: { state: "approved", status: "Approved · sent 8:14 AM" } };
export const Declined: Story = { args: { state: "declined" } };
