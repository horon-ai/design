import { useState } from "@lynx-js/react";

import { DateField } from "../../src/components/date-field";
import type { DateRange } from "../../src/components/calendar";

import { Backdrop } from "./backdrop";

const MONTH = new Date(2026, 10, 1);
const TODAY = new Date(2026, 10, 7);

function Examples({ surface }: { surface: "solid" | "glass" }) {
  const [date, setDate] = useState<Date | null>(() => new Date(2026, 10, 20));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <view className="flex flex-row flex-wrap items-start justify-center gap-6">
      {/* The three rungs stacked, so the height step reads down the column. */}
      <view className="flex flex-col items-start gap-3">
        <DateField surface={surface} size="sm" value={date} onValueChange={setDate} defaultMonth={MONTH} today={TODAY} />
        <DateField surface={surface} value={date} onValueChange={setDate} defaultMonth={MONTH} today={TODAY} />
        <DateField surface={surface} size="lg" value={date} onValueChange={setDate} defaultMonth={MONTH} today={TODAY} />
      </view>
      <view className="flex flex-col items-start gap-3">
        <DateField surface={surface} value={date} onValueChange={setDate} defaultMonth={MONTH} today={TODAY} />
        <DateField surface={surface} mode="range" value={range} onValueChange={setRange} defaultMonth={MONTH} today={TODAY} />
        <DateField surface={surface} disabled value={null} placeholder="Pick a date" />
        <DateField surface={surface} invalid placeholder="No date yet" />
      </view>
    </view>
  );
}

/** Both surfaces: three rungs, a range, a disabled field and an empty invalid one. */
export default function DateFieldDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
