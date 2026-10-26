import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Calendar",
  component: Calendar,
  decorators: [onBackdrop],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date(2026, 9, 26);

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 20));
    return <Calendar today={today} value={value} onValueChange={setValue} />;
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange>({ start: new Date(2026, 9, 20), end: new Date(2026, 9, 24) });
    return (
      <Calendar
        mode="range"
        today={today}
        value={value}
        onValueChange={setValue}
        isDateDisabled={(date) => date > new Date(2026, 9, 28)}
      />
    );
  },
};

export const Popover: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 26));
    return <Calendar variant="popover" today={today} value={value} onValueChange={setValue} />;
  },
};
