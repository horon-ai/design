import { Calendar } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

export default function CalendarDemo() {
  const [value, setValue] = useState<Date | null>(() => new Date());
  return (
    <Backdrop className="flex-col">
      <Calendar surface="glass" value={value} onValueChange={setValue} />
      <div className="flex flex-wrap items-start justify-center gap-4">
        <Calendar surface="glass" size="sm" />
        <Calendar surface="glass" size="md" />
        <Calendar surface="glass" size="lg" />
      </div>
      <Calendar surface="solid" value={value} onValueChange={setValue} />
    </Backdrop>
  );
}
