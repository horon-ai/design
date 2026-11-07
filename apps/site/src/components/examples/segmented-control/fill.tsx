import { SegmentedControl } from "@horon-ai/react";

const plans = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function SegmentedControlFill() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-6">
      <div className="flex w-64 flex-col items-start gap-2">
        <SegmentedControl aria-label="Billing, filled" fill defaultValue="monthly" items={plans} />
        <span className="text-caption text-text-secondary">fill</span>
      </div>
      <div className="flex w-64 flex-col items-start gap-2">
        <SegmentedControl aria-label="Billing, hugging" fill={false} defaultValue="monthly" items={plans} />
        <span className="text-caption text-text-secondary">fill: off</span>
      </div>
    </div>
  );
}
