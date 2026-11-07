import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "@horon-ai/react";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "thu", label: "T", name: "Thursday" },
  { value: "fri", label: "F", name: "Friday" },
  { value: "sat", label: "S", name: "Saturday" },
  { value: "sun", label: "S", name: "Sunday" },
];

const times = [
  { value: "7:00 AM", label: "7:00 AM" },
  { value: "8:00 AM", label: "8:00 AM" },
  { value: "9:00 AM", label: "9:00 AM" },
];

export default function ScheduleThumbnail() {
  // The index page sets flow margins on its own h3, which the card's title would
  // inherit; `[&_h3]:m-0` gives the card back its designed header height.
  return (
    <div className="w-85 scale-[0.95] [&_h3]:m-0">
      <ScheduleCard size="sm" title="Morning brief">
        <ScheduleSection size="sm" label="Days">
          <WeekdayPicker size="sm" days={days} defaultValue={["mon", "tue", "wed", "thu", "fri"]} />
        </ScheduleSection>
        <ScheduleSection size="sm" label="Time">
          <PickerField aria-label="Time" size="sm" surface="inset" items={times} defaultValue="8:00 AM" />
        </ScheduleSection>
      </ScheduleCard>
    </div>
  );
}
