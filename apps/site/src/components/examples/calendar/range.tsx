import { Calendar, type DateRange } from "@horon-ai/react";
import { useState } from "react";

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange>({ start: new Date(2026, 10, 16), end: new Date(2026, 10, 20) });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Calendar mode="range" value={range} onValueChange={setRange} defaultMonth={new Date(2026, 10, 1)} />
      <p className="text-caption text-text-secondary">
        {range.start && !range.end ? "Now pick the end day" : "Range complete"}
      </p>
    </div>
  );
}
