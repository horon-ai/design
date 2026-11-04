import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

export default function DateFieldDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <DateField surface="glass" size="sm" value={date} onValueChange={setDate} triggerClassName="max-w-44" />
        <DateField surface="glass" value={date} onValueChange={setDate} triggerClassName="max-w-44" />
        <DateField surface="glass" size="lg" value={date} onValueChange={setDate} triggerClassName="max-w-44" />
      </div>
      <DateField surface="glass" value={date} onValueChange={setDate} />
      <DateField surface="glass" mode="range" value={range} onValueChange={setRange} />
      <DateField value={date} onValueChange={setDate} />
    </Backdrop>
  );
}
