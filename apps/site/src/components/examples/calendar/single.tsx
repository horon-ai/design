import { Calendar } from "@horon-ai/react";
import { useState } from "react";

export default function CalendarSingle() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 10, 20));

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Calendar value={value} onValueChange={setValue} defaultMonth={new Date(2026, 10, 1)} />
      <p className="text-caption text-text-secondary">
        {value ? value.toDateString() : "Nothing picked yet"}
      </p>
    </div>
  );
}
