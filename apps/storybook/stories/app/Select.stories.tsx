import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "@horon/app";
import { Select } from "@horon/app/components/Select";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian (out of stock)", disabled: true },
];

function SelectDemo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [value, setValue] = useState("banana");
  return (
    <Stack gap={2} align="flex-start">
      <Select
        value={value}
        onValueChange={setValue}
        options={options}
        defaultOpen={defaultOpen}
        style={{ width: 260 }}
      />
      <Text variant="caption" tone="muted">
        Selected: {value}
      </Text>
    </Stack>
  );
}

const meta = {
  title: "App/Select",
  component: Select,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { options },
  render: () => <SelectDemo />,
};

export const Open: Story = {
  args: { options, defaultOpen: true },
  render: () => <SelectDemo defaultOpen />,
};

export const Disabled: Story = {
  args: { options },
  render: () => <Select value="apple" options={options} disabled style={{ width: 260 }} />,
};
