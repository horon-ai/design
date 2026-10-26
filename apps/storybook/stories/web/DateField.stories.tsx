import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/DateField",
  component: DateField,
  decorators: [onBackdrop],
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return <DateField value={value} onValueChange={setValue} />;
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange>({ start: new Date(2026, 9, 20), end: new Date(2026, 9, 24) });
    return <DateField mode="range" value={value} onValueChange={setValue} />;
  },
};

export const Error: Story = {
  render: () => <DateField invalid value={new Date(2026, 9, 20)} />,
};

export const Disabled: Story = { render: () => <DateField disabled /> };
