import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Input",
  component: Input,
  decorators: [onBackdrop],
  args: { placeholder: "Search bots", size: "md", surface: "glass", className: "w-80" },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    surface: { control: "inline-radio", options: ["glass", "solid"] },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { icon: <MagnifyingGlass /> } };

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["glass", "solid"] as const).map((surface) => (
        <div key={surface} className="flex flex-col gap-3">
          <Input surface={surface} className="w-80" icon={<MagnifyingGlass />} placeholder="Search bots" />
          <Input
            surface={surface}
            className="w-80"
            size="lg"
            icon={<MagnifyingGlass />}
            defaultValue="Chief of staff"
          />
          <Input surface={surface} className="w-80" invalid defaultValue="Inbox Manager" />
          <Input surface={surface} className="w-80" disabled placeholder="Search bots" />
        </div>
      ))}
    </div>
  ),
};
