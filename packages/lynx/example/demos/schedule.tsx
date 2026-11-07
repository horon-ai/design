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
      <view className="flex flex-row flex-wrap gap-3">
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
    <view className="flex flex-row flex-wrap items-start justify-center gap-4">
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
    <view className="flex flex-row flex-wrap items-start justify-center gap-4">
      <PickerField aria-label="Solid time" items={times} value={time} onValueChange={(next) => setTime(next ?? time)} />
      <PickerField aria-label="Glass time" surface="glass" items={times} defaultValue="9:00 AM" />
    </view>
  );
}

export default function ScheduleDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-col items-center gap-4">
          <FullCard surface="solid" />
          <SizeCards surface="solid" />
          <PickerStates />
        </view>
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <FullCard surface="glass" />
        <SizeCards surface="glass" />
      </Backdrop>
    </view>
  );
}
