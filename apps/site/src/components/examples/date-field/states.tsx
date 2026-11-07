import { DateField } from "@horon-ai/react";
import { useState } from "react";

export default function DateFieldStates() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <DateField value={date} onValueChange={setDate} placeholder="No date yet" />
      <DateField invalid placeholder="A date is required" />
      <DateField disabled value={new Date(2026, 9, 20)} />
    </div>
  );
}
