import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Banner",
  component: Banner,
  decorators: [onBackdrop],
  args: { className: "w-160" },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    children: "Inbox Manager needs your yes on 2 drafts.",
    action: <button type="button">Review</button>,
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    children: "Couldn't reach Gmail. Reconnect to keep Inbox Manager running.",
    action: <button type="button">Reconnect</button>,
  },
};
