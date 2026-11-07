import { Calendar } from "@horon-ai/react";

export default function CalendarThumbnail() {
  // February 2026 starts on a Sunday and has 28 days, so the grid is four rows:
  // the only month shape that fits the 225px tile at a legible scale.
  return (
    <div className="w-62.5 scale-[0.88]">
      <Calendar size="sm" locale="en-US" value={new Date(2026, 1, 12)} />
    </div>
  );
}
