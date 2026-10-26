import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/SegmentedControl",
  component: SegmentedControl,
  decorators: [onBackdrop],
  args: {
    "aria-label": "View",
    className: "w-50",
    defaultValue: "chat",
    items: [
      { value: "chat", label: "Chat" },
      { value: "work", label: "Work" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoItems: Story = {};

export const ThreeItems: Story = {
  args: {
    className: "w-72",
    items: [
      { value: "chat", label: "Chat" },
      { value: "work", label: "Work" },
      { value: "files", label: "Files" },
    ],
  },
};

export const Filter: Story = {
  args: {
    size: "lg",
    className: undefined,
    defaultValue: "all",
    items: [
      { value: "all", label: "All" },
      { value: "running", label: "Running" },
      { value: "done", label: "Done" },
    ],
  },
};
