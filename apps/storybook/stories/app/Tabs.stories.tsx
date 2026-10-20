import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "@horon/app";
import { Tabs } from "@horon/app/components/Tabs";

const items = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
  { value: "billing", label: "Billing", disabled: true },
];

function TabsDemo({ variant }: { variant?: "segmented" | "underline" }) {
  const [value, setValue] = useState("overview");
  return (
    <Stack gap={4} align="flex-start">
      <Tabs items={items} value={value} onValueChange={setValue} variant={variant} />
      <Text variant="bodySm" tone="muted">
        Active tab: {value}
      </Text>
    </Stack>
  );
}

const meta = {
  title: "App/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Segmented: Story = {
  args: { items, value: "overview" },
  render: () => <TabsDemo />,
};

export const Underline: Story = {
  args: { items, value: "overview", variant: "underline" },
  render: () => <TabsDemo variant="underline" />,
};

export const Static: Story = {
  args: { items, value: "activity" },
  render: () => <Tabs items={items} value="activity" />,
};
