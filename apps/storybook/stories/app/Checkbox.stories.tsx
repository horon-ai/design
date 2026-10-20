import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@horon/app";
import { Checkbox } from "@horon/app/components/Checkbox";

function CheckboxDemo() {
  const [terms, setTerms] = useState(true);
  const [news, setNews] = useState(false);
  return (
    <Stack gap={3} align="flex-start">
      <Checkbox checked={terms} onCheckedChange={setTerms} label="Accept terms" />
      <Checkbox checked={news} onCheckedChange={setNews} label="Subscribe to updates" />
      <Checkbox indeterminate label="Select all (mixed)" />
      <Checkbox checked disabled label="Disabled checked" />
      <Checkbox disabled label="Disabled" />
    </Stack>
  );
}

const meta = {
  title: "App/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CheckboxDemo />,
};

export const States: Story = {
  render: () => (
    <Stack gap={3} align="flex-start">
      <Checkbox label="Unchecked" />
      <Checkbox checked label="Checked" />
      <Checkbox indeterminate label="Indeterminate" />
      <Checkbox checked disabled label="Disabled checked" />
    </Stack>
  ),
};
