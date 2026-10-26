import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiquidGlass } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/LiquidGlass",
  component: LiquidGlass,
  decorators: [onBackdrop],
} satisfies Meta<typeof LiquidGlass>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tiers: Story = {
  render: () => (
    <div className="flex gap-4">
      {(
        [
          ["clear", "bg-glass-clear"],
          ["regular", "bg-glass-regular"],
          ["thick", "bg-glass-thick"],
        ] as const
      ).map(([tier, fill]) => (
        <div
          key={tier}
          className={`relative flex h-28 w-48 items-center justify-center rounded-xl border border-glass-rim-strong ${fill}`}
        >
          <LiquidGlass tier={tier} />
          <span className="relative text-label-md text-text-primary">{tier}</span>
        </div>
      ))}
    </div>
  ),
};
