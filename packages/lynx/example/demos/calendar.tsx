import { useState } from "@lynx-js/react";

import { Calendar } from "../../src/components/calendar";

import { Backdrop } from "./backdrop";

/**
 * Three rungs of the day picker calendar on both surfaces, with the middle one
 * controlled. The site demo follows the site locale; Lynx has no locale switch,
 * so this keeps the library default (`Intl` when the engine has it).
 */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  const [value, setValue] = useState<Date | null>(() => new Date(2026, 10, 20));
  return (
    <view className="flex flex-row flex-wrap items-start justify-center gap-4">
      <Calendar surface={surface} size="sm" />
      <Calendar surface={surface} value={value} onValueChange={setValue} />
      <Calendar surface={surface} size="lg" />
    </view>
  );
}

export default function CalendarDemo() {
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
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Popover, range and disabled days</text>
        <view className="flex flex-row flex-wrap items-start justify-center gap-4">
          <Calendar variant="popover" />
          <Calendar
            mode="range"
            weekStartsOn={1}
            isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
          />
        </view>
      </view>
    </view>
  );
}
