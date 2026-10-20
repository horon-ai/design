import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@horon/web/components/progress";

const meta = {
  title: "Web/Progress",
  component: Progress,
  parameters: { layout: "centered" },
  args: { value: 60 },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { value: 60, className: "w-72" },
};

export const WithLabel: Story = {
  args: { value: 72, className: "w-72 flex-col gap-1" },
  render: (args) => (
    <Progress {...args}>
      <div className="flex w-full items-center justify-between">
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue>{(formatted) => `${formatted ?? 0}%`}</ProgressValue>
      </div>
    </Progress>
  ),
};

export const Indeterminate: Story = {
  args: { value: null, className: "w-72" },
};

export const CustomTrack: Story = {
  args: { value: 35, className: "w-72 flex-col gap-2" },
  render: (args) => (
    <Progress {...args}>
      <ProgressTrack className="h-2 rounded-md">
        <ProgressIndicator className="rounded-md bg-accent" />
      </ProgressTrack>
    </Progress>
  ),
};
