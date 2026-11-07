import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "fri", label: "F", name: "Friday" },
];

const times = ["7:00 AM", "8:00 AM", "9:00 AM"].map((time) => ({ value: time, label: time }));

function Fills() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-3">
      <ScheduleSection size="sm" label="solid">
        <PickerField size="sm" aria-label="Time, solid" surface="solid" items={times} defaultValue="8:00 AM" />
      </ScheduleSection>
      <ScheduleSection size="sm" label="glass">
        <PickerField size="sm" aria-label="Time, glass" surface="glass" items={times} defaultValue="8:00 AM" />
      </ScheduleSection>
      <ScheduleSection size="sm" label="inset">
        <PickerField size="sm" aria-label="Time, inset" surface="inset" items={times} defaultValue="8:00 AM" />
      </ScheduleSection>
    </div>
  );
}

export default function ScheduleSurfaces() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-caption text-text-secondary">solid card</span>
        <ScheduleCard size="sm" surface="solid" title="Morning brief">
          <Fills />
          <ScheduleSection size="sm" label="Days">
            <WeekdayPicker size="sm" aria-label="Days" days={days} defaultValue={["mon", "wed", "fri"]} />
          </ScheduleSection>
        </ScheduleCard>
      </div>
      <Backdrop className="flex-col">
        <span className="text-caption text-text-secondary">glass card</span>
        <ScheduleCard size="sm" surface="glass" title="Morning brief">
          <Fills />
          <ScheduleSection size="sm" label="Days">
            <WeekdayPicker size="sm" aria-label="Days" days={days} defaultValue={["mon", "wed", "fri"]} />
          </ScheduleSection>
        </ScheduleCard>
      </Backdrop>
    </div>
  );
}
