import type { Meta, StoryObj } from "@storybook/react-vite";
import { HStack, Stack } from "@horon/app";
import { Skeleton } from "@horon/app/components/Skeleton";

const meta = {
  title: "App/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton width={240} height={20} />,
};

export const TextLines: Story = {
  render: () => (
    <Stack gap={2} style={{ width: 320 }}>
      <Skeleton width="100%" height={14} />
      <Skeleton width="90%" height={14} />
      <Skeleton width="75%" height={14} />
    </Stack>
  ),
};

export const Avatar: Story = {
  render: () => <Skeleton circle width={48} height={48} />,
};

export const Card: Story = {
  render: () => (
    <HStack gap={3} style={{ width: 320 }}>
      <Skeleton circle width={48} height={48} />
      <Stack gap={2} style={{ flex: 1 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="100%" height={14} />
      </Stack>
    </HStack>
  ),
};
