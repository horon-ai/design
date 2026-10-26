import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@horon-ai/react";

const meta = {
  title: "Web/Badge",
  component: Badge,
  args: { children: "Draft", tone: "neutral" },
  argTypes: { tone: { control: "inline-radio", options: ["neutral", "brand", "danger", "solid"] } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[false, true].map((dot) => (
        <div key={String(dot)} className="flex gap-2">
          <Badge dot={dot}>Draft</Badge>
          <Badge dot={dot} tone="brand">
            ON
          </Badge>
          <Badge dot={dot} tone="danger">
            Failed
          </Badge>
          <Badge dot={dot} tone="solid">
            New
          </Badge>
        </div>
      ))}
    </div>
  ),
};
