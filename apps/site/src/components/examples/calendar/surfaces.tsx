import { Calendar } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function CalendarSurfaces() {
  const month = new Date(2026, 10, 1);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <Calendar surface="solid" defaultMonth={month} />
        <Calendar surface="flat" defaultMonth={month} />
      </div>
      <Backdrop className="flex-col">
        <Calendar surface="glass" defaultMonth={month} />
      </Backdrop>
    </div>
  );
}
