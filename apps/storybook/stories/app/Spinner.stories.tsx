import type { Meta, StoryObj } from "@storybook/react-vite";
import { HStack, Spinner, Stack, Text } from "@horon/app";

const meta = {
  title: "App/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <HStack gap={4} align="center">
      <Spinner size="small" />
      <Spinner size="large" />
    </HStack>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Stack gap={2} align="center">
      <Spinner />
      <Text variant="caption" tone="muted">
        Loading…
      </Text>
    </Stack>
  ),
};
