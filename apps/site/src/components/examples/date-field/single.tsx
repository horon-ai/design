import { DateField } from "@horon-ai/react";
import { useState } from "react";

export default function DateFieldSingle() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <DateField value={date} onValueChange={setDate} />
      <p className="text-caption text-text-secondary">
        {date ? `Selected ${date.toDateString()}` : "Nothing picked yet"}
      </p>
    </div>
  );
}
