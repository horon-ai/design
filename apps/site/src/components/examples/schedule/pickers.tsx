import { PickerField, ScheduleCard, ScheduleSection } from "@horon-ai/react";
import { EnvelopeSimple } from "@phosphor-icons/react";

const times = ["7:00 AM", "8:00 AM", "9:00 AM"].map((time) => ({ value: time, label: time }));

export default function SchedulePickers() {
  return (
    <ScheduleCard title="Delivery">
      <div className="flex flex-wrap gap-3">
        <ScheduleSection label="Time">
          <PickerField aria-label="Time" surface="inset" items={times} defaultValue="8:00 AM" />
        </ScheduleSection>
        <ScheduleSection label="Report to">
          <PickerField
            aria-label="Report to"
            surface="inset"
            icon={<EnvelopeSimple />}
            items={[
              { value: "email", label: "Email" },
              { value: "slack", label: "Slack" },
            ]}
            defaultValue="email"
          />
        </ScheduleSection>
      </div>
    </ScheduleCard>
  );
}
