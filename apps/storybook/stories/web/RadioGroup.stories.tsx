import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "@horon-ai/react";

const meta = {
  title: "Web/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="daily" aria-label="Summary frequency">
      <Radio value="daily" label="Every day" />
      <Radio value="weekly" label="Every week" />
      <Radio value="never" label="Never" disabled />
    </RadioGroup>
  ),
};
