import { Textarea } from "@horon-ai/react";

export default function TextareaSizes() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-3">
      <Textarea className="w-52" size="sm" placeholder="Small" aria-label="Small textarea" />
      <Textarea className="w-52" size="md" placeholder="Medium" aria-label="Medium textarea" />
      <Textarea className="w-52" size="lg" placeholder="Large" aria-label="Large textarea" />
    </div>
  );
}
