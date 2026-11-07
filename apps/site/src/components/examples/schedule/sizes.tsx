import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "@horon-ai/react";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "thu", label: "T", name: "Thursday" },
  { value: "fri", label: "F", name: "Friday" },
];

const times = ["7:00 AM", "8:00 AM", "9:00 AM"].map((time) => ({ value: time, label: time }));

export default function ScheduleSizes() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ScheduleCard key={size} size={size} title="Morning brief">
          <ScheduleSection size={size} label="Days">
            <WeekdayPicker size={size} aria-label="Days" days={days} defaultValue={["mon", "wed", "fri"]} />
          </ScheduleSection>
          <ScheduleSection size={size} label="Time">
            <PickerField size={size} aria-label="Time" surface="inset" items={times} defaultValue="8:00 AM" />
          </ScheduleSection>
        </ScheduleCard>
      ))}
    </div>
  );
}
