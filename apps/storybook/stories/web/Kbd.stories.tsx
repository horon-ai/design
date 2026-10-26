import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "@horon-ai/react";

const meta = { title: "Web/Kbd", component: Kbd, args: { children: "esc" } } satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Shortcut: Story = { args: { children: "⌘K" } };
