import { Calendar } from "@horon-ai/react";

export default function CalendarPopover() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Calendar variant="popover" defaultMonth={new Date(2026, 10, 1)} />
      <p className="text-caption text-text-secondary">popover variant, as opened by a DateField</p>
    </div>
  );
}
