import { SegmentedControl } from "@horon-ai/react";

const items = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export default function SegmentedControlThumbnail() {
  // The sliding pill is measured after mount, so a static tile would show the labels
  // with no selection. The pressed segment paints the same 10% ink fill instead.
  return (
    <SegmentedControl
      aria-label="Range"
      items={items}
      defaultValue="week"
      className="w-60 [&_[data-pressed]]:bg-overlay-ink-10"
    />
  );
}
