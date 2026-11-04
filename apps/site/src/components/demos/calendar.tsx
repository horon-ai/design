import { Calendar } from "@horon-ai/react";
import { useState } from "react";

import { localeTags } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { Backdrop } from "../demo-backdrop";

export default function CalendarDemo() {
  const locale = useLocale();
  const tag = localeTags[locale];
  const [value, setValue] = useState<Date | null>(() => new Date());
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <Calendar surface="solid" value={value} onValueChange={setValue} locale={tag} />
          <Calendar surface="solid" size="sm" locale={tag} />
          <Calendar surface="solid" size="md" locale={tag} />
          <Calendar surface="solid" size="lg" locale={tag} />
        </div>
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <Calendar surface="glass" value={value} onValueChange={setValue} locale={tag} />
          <Calendar surface="glass" size="sm" locale={tag} />
          <Calendar surface="glass" size="md" locale={tag} />
          <Calendar surface="glass" size="lg" locale={tag} />
        </div>
      </Backdrop>
    </div>
  );
}
