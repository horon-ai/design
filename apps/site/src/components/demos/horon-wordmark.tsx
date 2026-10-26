import { HoronWordmark } from "@horon-ai/react";

export default function HoronWordmarkDemo() {
  return (
    <div className="flex items-end gap-6 text-text-primary">
      <HoronWordmark />
      <HoronWordmark height={23} />
    </div>
  );
}
