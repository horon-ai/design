import { HoronIcon } from "@horon-ai/react";

export default function HoronIconSizes() {
  return (
    <div className="flex items-center gap-6 text-text-primary">
      <HoronIcon size={16} />
      <HoronIcon size={24} />
      <HoronIcon size={32} />
    </div>
  );
}
