import { DateField, type DateRange } from "@horon-ai/react";
import { useState } from "react";

import { localeTags } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface, locale }: { surface: "solid" | "glass"; locale: string }) {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      {/* The three rungs stacked, so the height step reads down the column. */}
      <div className="flex flex-col items-start gap-3">
        <DateField surface={surface} size="sm" value={date} onValueChange={setDate} locale={locale} />
        <DateField surface={surface} value={date} onValueChange={setDate} locale={locale} />
        <DateField surface={surface} size="lg" value={date} onValueChange={setDate} locale={locale} />
      </div>
      <div className="flex flex-col items-start gap-3">
        <DateField surface={surface} value={date} onValueChange={setDate} locale={locale} />
        <DateField surface={surface} mode="range" value={range} onValueChange={setRange} locale={locale} />
        <DateField surface={surface} invalid placeholder="No date yet" locale={locale} />
      </div>
    </div>
  );
}

export default function DateFieldDemo() {
  const tag = localeTags[useLocale()];
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" locale={tag} />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" locale={tag} />
      </Backdrop>
    </div>
  );
}
