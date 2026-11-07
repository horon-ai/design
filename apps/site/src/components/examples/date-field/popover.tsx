import { Calendar, DateField } from "@horon-ai/react";
import { useState } from "react";

export default function DateFieldPopover() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-wrap items-start justify-center gap-3">
        <DateField value={date} onValueChange={setDate} />
        <DateField variant="popover" value={date} onValueChange={setDate} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Calendar variant="popover" value={date} onValueChange={setDate} className="w-77 max-w-full" />
        <span className="text-caption text-text-secondary">The calendar the popover variant opens</span>
      </div>
    </div>
  );
}
