import { DateField } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../../demo-backdrop";

export default function DateFieldSizes() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-col items-start gap-2">
        <DateField size="sm" value={date} onValueChange={setDate} />
        <DateField size="md" value={date} onValueChange={setDate} />
        <DateField size="lg" value={date} onValueChange={setDate} />
      </div>
      <div className="flex flex-wrap items-start justify-center gap-3">
        <DateField surface="solid" value={date} onValueChange={setDate} />
        <DateField surface="solid-on-page" value={date} onValueChange={setDate} />
      </div>
      <Backdrop className="flex-col">
        <DateField surface="glass" value={date} onValueChange={setDate} />
      </Backdrop>
    </div>
  );
}
