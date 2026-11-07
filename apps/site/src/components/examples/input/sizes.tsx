import { Input } from "@horon-ai/react";

export default function InputSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-3">
      <Input className="w-44" size="sm" placeholder="Small" aria-label="Small input" />
      <Input className="w-44" size="md" placeholder="Medium" aria-label="Medium input" />
      <Input className="w-44" size="lg" placeholder="Large" aria-label="Large input" />
    </div>
  );
}
