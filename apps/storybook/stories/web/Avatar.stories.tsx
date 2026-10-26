import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@horon-ai/react";

const meta = {
  title: "Web/Avatar",
  component: Avatar,
  args: { children: "MY", size: "md", type: "initials" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    type: { control: "inline-radio", options: ["initials", "bot", "image"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["initials", "bot"] as const).map((type) => (
        <div key={type} className="flex items-center gap-3">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <Avatar key={size} type={type} size={size}>
              MY
            </Avatar>
          ))}
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <Avatar key={`live-${size}`} type={type} size={size} live>
              MY
            </Avatar>
          ))}
        </div>
      ))}
    </div>
  ),
};
