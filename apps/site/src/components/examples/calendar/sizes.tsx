import { Calendar } from "@horon-ai/react";

export default function CalendarSizes() {
  const month = new Date(2026, 10, 1);

  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <Calendar size="sm" defaultMonth={month} weekStartsOn={1} />
      <Calendar size="md" defaultMonth={month} weekStartsOn={1} />
      <Calendar size="lg" defaultMonth={month} weekStartsOn={1} />
    </div>
  );
}
