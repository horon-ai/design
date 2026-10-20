import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HStack, Stack, Text } from "@horon/app";
import { Chip } from "@horon/app/components/Chip";

const meta = {
  title: "App/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  args: { label: "Chip" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = ["Design", "Engineering", "Marketing", "Research"];

function ChipDemo() {
  const [selected, setSelected] = useState<string[]>(["Design"]);
  const toggle = (tag: string) =>
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  return (
    <Stack gap={3} align="flex-start">
      <HStack gap={2} wrap>
        {tags.map((tag) => (
          <Chip key={tag} label={tag} selected={selected.includes(tag)} onPress={() => toggle(tag)} />
        ))}
      </HStack>
      <Text variant="caption" tone="muted">
        Selected: {selected.join(", ") || "none"}
      </Text>
    </Stack>
  );
}

export const Selectable: Story = {
  render: () => <ChipDemo />,
};

export const States: Story = {
  render: () => (
    <HStack gap={2} wrap>
      <Chip label="Default" />
      <Chip label="Selected" selected />
      <Chip label="Disabled" disabled />
    </HStack>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <HStack gap={2} wrap>
      <Chip label="Removable" onDismiss={() => undefined} />
      <Chip label="Removable selected" selected onDismiss={() => undefined} />
    </HStack>
  ),
};
