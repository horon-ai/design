import { WeekdayPicker } from "@horon-ai/react";
import { useState } from "react";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "thu", label: "T", name: "Thursday" },
  { value: "fri", label: "F", name: "Friday" },
  { value: "sat", label: "S", name: "Saturday" },
  { value: "sun", label: "S", name: "Sunday" },
];

export default function ScheduleWeekdays() {
  const [selected, setSelected] = useState<string[]>(["mon", "wed", "fri"]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <WeekdayPicker aria-label="Repeat on" days={days} value={selected} onValueChange={setSelected} />
      <p className="text-caption text-text-secondary">
        {selected.length === 0 ? "Every day" : `${selected.length} days a week`}
      </p>
    </div>
  );
}
