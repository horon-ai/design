import { useState } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "../../src/components/schedule";
import { SegmentedControl } from "../../src/components/segmented-control";

import { Backdrop } from "./backdrop";

const days = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "thu", label: "T", name: "Thursday" },
  { value: "fri", label: "F", name: "Friday" },
  { value: "sat", label: "S", name: "Saturday" },
  { value: "sun", label: "S", name: "Sunday" },
];

const frequency = ["Daily", "Weekdays", "Weekly", "Custom"].map((label) => ({ value: label.toLowerCase(), label }));
const times = ["7:00 AM", "8:00 AM", "9:00 AM"].map((time) => ({ value: time, label: time }));

/**
 * The full card: repeat segment, weekday circles and two pickers, on either
 * surface. The pickers keep their own uncontrolled selection, so the demo shows
 * the closed fields and the open list side by side.
 */
function FullCard({ surface }: { surface: "solid" | "glass" }) {
  return (
    <ScheduleCard surface={surface} title="Morning brief" nextRun="Next run: Tomorrow, 8:00 AM">
      <ScheduleSection label="Repeat">
        <SegmentedControl aria-label="Repeat" size="sm" surface="inset" fill items={frequency} defaultValue="weekdays" />
      </ScheduleSection>
      <ScheduleSection label="Days">
        <WeekdayPicker days={days} defaultValue={["mon", "tue", "wed", "thu", "fri"]} />
      </ScheduleSection>
      <view className="flex flex-col gap-3">
        <ScheduleSection label="Time">
          <PickerField aria-label="Time" surface="inset" items={times} defaultValue="8:00 AM" />
        </ScheduleSection>
        <ScheduleSection label="Report to">
          <PickerField
            aria-label="Report to"
            surface="inset"
            icon={<Icon name="EnvelopeSimple" size={16} color="text-secondary" />}
            items={[{ value: "email", label: "Email" }]}
            defaultValue="email"
          />
        </ScheduleSection>
      </view>
    </ScheduleCard>
  );
}

/** The three rungs, each with its own weekday and time controls. */
function SizeCards({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex flex-row flex-wrap items-start gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ScheduleCard key={size} size={size} surface={surface} title="Morning brief">
          <ScheduleSection size={size} label="Days">
            <WeekdayPicker size={size} days={days} defaultValue={["mon", "tue", "wed", "thu", "fri"]} />
          </ScheduleSection>
          <ScheduleSection size={size} label="Time">
            <PickerField size={size} aria-label="Time" surface="inset" items={times} defaultValue="8:00 AM" />
          </ScheduleSection>
        </ScheduleCard>
      ))}
    </view>
  );
}

/** A standalone open picker on each surface, so the popup and its rows stay visible. */
function PickerStates() {
  const [time, setTime] = useState("8:00 AM");
  return (
    <view className="flex flex-col items-center gap-4">
      <PickerField aria-label="Solid time" items={times} value={time} onValueChange={(next) => setTime(next ?? time)} />
      <PickerField aria-label="Glass time" surface="glass" items={times} defaultValue="9:00 AM" />
    </view>
  );
}

export default function ScheduleDemo() {
  return (
    // The gallery holds the app in a fixed viewport-height column (`contain: strict` on `<lynx-view>`),
    // and Lynx gives every `<view>` `min-height: 0` with `flex-shrink: 1`, so a demo taller than the
    // viewport is squeezed instead of overflowing it. The squeeze runs down the whole column chain: each
    // card keeps its own height (`shrink-0` in `ScheduleCard`) while its column collapses, and the next
    // block then paints over the card. The demo therefore stays inside one screen as three columns of
    // explicit width and `shrink-0`, so every column keeps its content height and nothing is squeezed.
    <view className="flex w-full shrink-0 flex-row items-start justify-center gap-4">
      <view className="flex w-[380px] shrink-0 flex-col gap-2">
        <text className="text-caption text-text-secondary">Solid</text>
        <FullCard surface="solid" />
        <SizeCards surface="solid" />
      </view>
      <view className="flex w-[420px] shrink-0 flex-col gap-2">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <FullCard surface="glass" />
          <SizeCards surface="glass" />
        </Backdrop>
      </view>
      <view className="flex w-[190px] shrink-0 flex-col gap-2">
        <text className="text-caption text-text-secondary">Pickers</text>
        <PickerStates />
      </view>
    </view>
  );
}
