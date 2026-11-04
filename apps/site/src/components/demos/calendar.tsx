import { Calendar } from "@horon-ai/react";
import { useState } from "react";

import { localeTags } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { Backdrop } from "../demo-backdrop";

export default function CalendarDemo() {
  const locale = useLocale();
  const [value, setValue] = useState<Date | null>(() => new Date());
  return (
    <Backdrop>
      <Calendar value={value} onValueChange={setValue} locale={localeTags[locale]} />
    </Backdrop>
  );
}
