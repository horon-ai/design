import { PickerField, ScheduleCard, ScheduleSection, SegmentedControl, WeekdayPicker } from "@horon-ai/react";
import { EnvelopeSimple } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

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

function FullCard({ surface }: { surface: "solid" | "glass" }) {
  return (
    <ScheduleCard surface={surface} title="Morning brief" nextRun="Next run: Tomorrow, 8:00 AM">
      <ScheduleSection label="Repeat">
        <SegmentedControl
          aria-label="Repeat"
          size="sm"
          surface="inset"
          fill
          items={frequency}
          defaultValue="weekdays"
        />
      </ScheduleSection>
      <ScheduleSection label="Days">
        <WeekdayPicker days={days} defaultValue={["mon", "tue", "wed", "thu", "fri"]} />
      </ScheduleSection>
      <div className="flex gap-3">
        <ScheduleSection label="Time">
          <PickerField aria-label="Time" surface="inset" items={times} defaultValue="8:00 AM" />
        </ScheduleSection>
        <ScheduleSection label="Report to">
          <PickerField
            aria-label="Report to"
            surface="inset"
            icon={<EnvelopeSimple />}
            items={[{ value: "email", label: "Email" }]}
            defaultValue="email"
          />
        </ScheduleSection>
      </div>
    </ScheduleCard>
  );
}

function SizeCards({ surface }: { surface: "solid" | "glass" }) {
  return (
    <>
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
    </>
  );
}

export default function ScheduleDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-col items-center gap-4">
          <FullCard surface="solid" />
          <div className="flex w-full flex-wrap items-start justify-center gap-4">
            <SizeCards surface="solid" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <FullCard surface="glass" />
          <div className="flex w-full flex-wrap items-start justify-center gap-4">
            <SizeCards surface="glass" />
          </div>
        </Backdrop>
      </div>
    </div>
  );
}
