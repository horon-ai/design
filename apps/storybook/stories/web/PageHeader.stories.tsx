import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton, PageHeader, SegmentedControl } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/PageHeader",
  component: PageHeader,
  decorators: [onBackdrop],
  args: { title: "Routines", className: "w-97.5" },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFilter: Story = {
  render: (args) => (
    <PageHeader {...args} onBack={() => undefined} actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}>
      <SegmentedControl
        aria-label="Status"
        surface="inset-faint"
        fill={false}
        className="h-9 px-[3px]"
        defaultValue="running"
        items={[
          { value: "all", label: "All" },
          { value: "running", label: "Running" },
          { value: "done", label: "Done" },
          { value: "failed", label: "Failed" },
        ]}
      />
    </PageHeader>
  ),
};
