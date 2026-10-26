import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoronIcon, TabBar } from "@horon-ai/react";
import { Bell, Cube, User } from "@phosphor-icons/react";
import { useState } from "react";

import { onBackdrop } from "../support";

const items = [
  { value: "horon", label: "Horon", icon: <HoronIcon /> },
  { value: "inbox", label: "Inbox", icon: <Bell /> },
  { value: "artifacts", label: "Artifacts", icon: <Cube /> },
  { value: "me", label: "Me", icon: <User /> },
];

const meta = {
  title: "Web/TabBar",
  component: TabBar,
  decorators: [onBackdrop],
  args: { items, value: "horon" },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <TabBar {...args} value={value} onValueChange={setValue} />;
  },
};
