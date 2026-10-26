import type { Meta, StoryObj } from "@storybook/react-vite";
import { PickerField, ScheduleCard, ScheduleSection, SegmentedControl, WeekdayPicker } from "@horon-ai/react";
import { EnvelopeSimple } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "thu", label: "T", name: "Thursday" },
  { value: "fri", label: "F", name: "Friday" },
  { value: "sat", label: "S", name: "Saturday" },
  { value: "sun", label: "S", name: "Sunday" },
];
const frequency = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];
const times = ["7:00 AM", "8:00 AM", "9:00 AM"].map((time) => ({ value: time, label: time }));

const meta = {
  title: "Web/Schedule",
  component: ScheduleCard,
  decorators: [onBackdrop],
  args: { title: "Morning brief", children: null },
} satisfies Meta<typeof ScheduleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Parts: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <PickerField aria-label="Time" items={times} defaultValue="8:00 AM" />
      <WeekdayPicker days={days} defaultValue={["mon", "tue", "wed", "thu", "fri"]} />
      <SegmentedControl aria-label="Repeat" size="sm" items={frequency} defaultValue="weekdays" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <ScheduleCard title="Morning brief" nextRun="Next run: Tomorrow, 8:00 AM">
      <ScheduleSection label="Repeat">
        <SegmentedControl
          aria-label="Repeat"
          size="sm"
          surface="inset"
          fill
          items={frequency}
          defaultValue="weekdays"
        />
      </ScheduleSection>
      <ScheduleSection label="Days">
        <WeekdayPicker days={days} defaultValue={["mon", "tue", "wed", "thu", "fri"]} />
      </ScheduleSection>
      <div className="flex gap-3">
        <ScheduleSection label="Time">
          <PickerField aria-label="Time" surface="inset" items={times} defaultValue="8:00 AM" />
        </ScheduleSection>
        <ScheduleSection label="Report to">
          <PickerField
            aria-label="Report to"
            surface="inset"
            icon={<EnvelopeSimple />}
            items={[{ value: "email", label: "Email" }]}
            defaultValue="email"
          />
        </ScheduleSection>
      </div>
    </ScheduleCard>
  ),
};
