import { Calendar } from "@horon-ai/react";

const week = [
  new Date(2026, 10, 16),
  new Date(2026, 10, 17),
  new Date(2026, 10, 18),
  new Date(2026, 10, 19),
  new Date(2026, 10, 20),
];

export default function CalendarHighlight() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Calendar
        defaultMonth={new Date(2026, 10, 1)}
        highlight={week}
        // Saturday and Sunday are blocked, so the picker offers working days only.
        isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
      <p className="text-caption text-text-secondary">The week of Nov 16 is highlighted; weekends are disabled.</p>
    </div>
  );
}
