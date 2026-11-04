import { Calendar } from "@horon-ai/react";
import { useState } from "react";

import { localeTags } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface, locale }: { surface: "solid" | "glass"; locale: string }) {
  const [value, setValue] = useState<Date | null>(() => new Date(2026, 10, 20));
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <Calendar surface={surface} size="sm" locale={locale} />
      <Calendar surface={surface} value={value} onValueChange={setValue} locale={locale} />
      <Calendar surface={surface} size="lg" locale={locale} />
    </div>
  );
}

export default function CalendarDemo() {
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
