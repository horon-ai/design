import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Switch",
  component: Switch,
  args: { size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled" disabled defaultChecked />
      <Switch size="sm" aria-label="Small off" />
      <Switch size="sm" aria-label="Small on" defaultChecked />
    </div>
  ),
};

/** Figma `Settings example` (58:265). */
export const SettingsList: Story = {
  decorators: [onBackdrop],
  render: () => (
    <div className="relative flex w-120 flex-col overflow-clip rounded-[16px] border border-glass-rim-strong bg-glass-thick">
      {["Keep working after I close the laptop", "Ask before sending email", "Share usage with the team"].map(
        (label, index) => (
          <div key={label} className={index ? "border-t border-border-default" : undefined}>
            <Switch className="flex w-full px-5 py-4" label={label} defaultChecked={index < 2} />
          </div>
        ),
      )}
    </div>
  ),
};
