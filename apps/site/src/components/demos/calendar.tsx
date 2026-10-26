import { Calendar } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

export default function CalendarDemo() {
  const [value, setValue] = useState<Date | null>(() => new Date());
  return (
    <Backdrop>
      <Calendar value={value} onValueChange={setValue} />
    </Backdrop>
  );
}
