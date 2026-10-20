import type { Meta, StoryObj } from "@storybook/react-vite";
import { HStack, Stack, Text } from "@horon/app";
import { Badge } from "@horon/app/components/Badge";

const meta = {
  title: "App/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "destructive", "success", "warning"],
    },
  },
  args: { label: "Badge" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <HStack gap={2} wrap>
      <Badge variant="default" label="Default" />
      <Badge variant="secondary" label="Secondary" />
      <Badge variant="outline" label="Outline" />
      <Badge variant="destructive" label="Destructive" />
      <Badge variant="success" label="Success" />
      <Badge variant="warning" label="Warning" />
    </HStack>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Stack gap={3} align="flex-start">
      <Badge variant="success">Synced</Badge>
      <Text variant="caption" tone="muted">
        Badge accepts a label prop or children.
      </Text>
    </Stack>
  ),
};
