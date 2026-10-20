import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@horon/web/components/skeleton";

const meta = {
  title: "Web/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { className: "h-4 w-48" },
};

export const Lines: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-52" />
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-72 items-center gap-4 rounded-xl border border-border p-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  ),
};
