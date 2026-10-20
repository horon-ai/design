import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateRange } from "@horon/web/components/date-picker";
import { Calendar } from "@horon/web/components/calendar";

const meta = {
  title: "Web/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function SingleCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 14));

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={date}
      className="rounded-md border border-border"
    />
  );
}

export const Playground: Story = {
  render: () => <SingleCalendar />,
};

function RangeCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 9, 5),
    to: new Date(2026, 9, 18),
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={range?.from}
      numberOfMonths={2}
      className="rounded-md border border-border"
    />
  );
}

export const Range: Story = {
  render: () => <RangeCalendar />,
};

export const Dropdown: Story = {
  render: () => (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      defaultMonth={new Date(2026, 9, 14)}
      className="rounded-md border border-border"
    />
  ),
};
