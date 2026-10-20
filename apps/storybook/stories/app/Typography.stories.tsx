import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text, type TextVariant } from "@horon/app";

const variants: TextVariant[] = ["display", "title", "subtitle", "body", "bodySm", "caption", "label", "code"];

const meta = {
  title: "App/Typography",
  component: Text,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <Stack gap={4} align="flex-start">
      {variants.map((variant) => (
        <Text key={variant} variant={variant}>
          {variant} — The quick brown fox jumps over the lazy dog
        </Text>
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack gap={2} align="flex-start">
      <Text tone="default">Default tone</Text>
      <Text tone="muted">Muted tone</Text>
      <Text tone="primary">Primary tone</Text>
      <Text tone="destructive">Destructive tone</Text>
      <Text tone="success">Success tone</Text>
      <Text tone="warning">Warning tone</Text>
    </Stack>
  ),
};
