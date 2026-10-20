import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect } from "@horon/web/components/native-select";

const meta = {
  title: "Web/NativeSelect",
  component: NativeSelect,
  parameters: { layout: "centered" },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <NativeSelect defaultValue="apple" aria-label="Fruit">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
      <option value="durian" disabled>
        Durian (out of stock)
      </option>
    </NativeSelect>
  ),
};

export const Small: Story = {
  render: () => (
    <NativeSelect size="sm" defaultValue="day" aria-label="Range">
      <option value="day">Last day</option>
      <option value="week">Last week</option>
      <option value="month">Last month</option>
    </NativeSelect>
  ),
};

export const Disabled: Story = {
  render: () => (
    <NativeSelect disabled defaultValue="locked" aria-label="Plan">
      <option value="locked">Locked plan</option>
    </NativeSelect>
  ),
};
