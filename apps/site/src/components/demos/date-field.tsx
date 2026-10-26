import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

export default function DateFieldDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Backdrop className="flex-col">
      <DateField value={date} onValueChange={setDate} />
      <DateField mode="range" value={range} onValueChange={setRange} />
    </Backdrop>
  );
}
