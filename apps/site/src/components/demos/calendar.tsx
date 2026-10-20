import { Calendar } from "@horon/web";

const month = new Date(2026, 9, 1);
const selected = new Date(2026, 9, 14);

export default function CalendarDemo() {
  return (
    <Calendar mode="single" selected={selected} defaultMonth={month} className="rounded-md border border-border" />
  );
}
