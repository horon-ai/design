import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

export default function DateFieldRange() {
  const [range, setRange] = useState<DateRange>({ start: new Date(2026, 9, 20), end: new Date(2026, 9, 24) });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <DateField mode="range" value={range} onValueChange={setRange} placeholder="Pick a date range" />
      <p className="text-caption text-text-secondary">
        {range.start && !range.end ? "Pick an end date" : "Range complete"}
      </p>
    </div>
  );
}
