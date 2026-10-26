import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton, Tooltip } from "@horon-ai/react";
import { Copy } from "@phosphor-icons/react";

const meta = {
  title: "Web/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  args: { label: "Copy", children: <IconButton icon={<Copy />} label="Copy" /> },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {};
export const Bottom: Story = { args: { side: "bottom" } };
