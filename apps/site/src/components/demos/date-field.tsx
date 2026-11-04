import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { localeTags } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { Backdrop } from "../demo-backdrop";

export default function DateFieldDemo() {
  const locale = useLocale();
  const tag = localeTags[locale];
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex flex-wrap items-end justify-center gap-3">
          <DateField surface="solid" size="sm" value={date} onValueChange={setDate} locale={tag} triggerClassName="max-w-44" />
          <DateField surface="solid" value={date} onValueChange={setDate} locale={tag} triggerClassName="max-w-44" />
          <DateField surface="solid" size="lg" value={date} onValueChange={setDate} locale={tag} triggerClassName="max-w-44" />
        </div>
        <DateField surface="solid" value={date} onValueChange={setDate} locale={tag} />
        <DateField surface="solid" mode="range" value={range} onValueChange={setRange} locale={tag} />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <div className="flex flex-wrap items-end justify-center gap-3">
          <DateField surface="glass" size="sm" value={date} onValueChange={setDate} locale={tag} triggerClassName="max-w-44" />
          <DateField surface="glass" value={date} onValueChange={setDate} locale={tag} triggerClassName="max-w-44" />
          <DateField surface="glass" size="lg" value={date} onValueChange={setDate} locale={tag} triggerClassName="max-w-44" />
        </div>
        <DateField surface="glass" value={date} onValueChange={setDate} locale={tag} />
        <DateField surface="glass" mode="range" value={range} onValueChange={setRange} locale={tag} />
      </Backdrop>
    </div>
  );
}
