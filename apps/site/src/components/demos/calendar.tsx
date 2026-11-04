import { Calendar } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

export default function CalendarDemo() {
  const [value, setValue] = useState<Date | null>(() => new Date());
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <Calendar surface="solid" value={value} onValueChange={setValue} />
          <Calendar surface="solid" size="sm" />
          <Calendar surface="solid" size="md" />
          <Calendar surface="solid" size="lg" />
        </div>
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <Calendar surface="glass" value={value} onValueChange={setValue} />
          <Calendar surface="glass" size="sm" />
          <Calendar surface="glass" size="md" />
          <Calendar surface="glass" size="lg" />
        </div>
      </Backdrop>
    </div>
  );
}
