import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { localeTags } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { Backdrop } from "../demo-backdrop";

export default function DateFieldDemo() {
  const locale = useLocale();
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Backdrop className="flex-col">
      <DateField value={date} onValueChange={setDate} locale={localeTags[locale]} />
      <DateField mode="range" value={range} onValueChange={setRange} locale={localeTags[locale]} />
    </Backdrop>
  );
}
