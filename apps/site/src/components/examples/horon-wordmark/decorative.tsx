import { HoronWordmark } from "@horon-ai/react";

export default function HoronWordmarkDecorative() {
  return (
    <div className="flex items-center gap-2 text-text-primary">
      <span className="text-label-lg font-semibold">Horon</span>
      <HoronWordmark title="" aria-hidden height={11.5} className="text-text-secondary" />
    </div>
  );
}
