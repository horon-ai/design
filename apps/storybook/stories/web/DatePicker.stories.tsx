import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker, DateRangePicker } from "@horon/web/components/date-picker";

const meta = {
  title: "Web/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <DatePicker />,
};

export const WithDefaultValue: Story = {
  render: () => <DatePicker defaultValue={new Date(2026, 9, 14)} />,
};

export const Disabled: Story = {
  render: () => <DatePicker disabled />,
};

export const DateRange: Story = {
  render: () => <DateRangePicker />,
};
