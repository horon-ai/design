import { Composer } from "@horon-ai/react";

export default function ComposerSizes() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Composer size="sm" className="w-full max-w-72" placeholder="Small" />
      <Composer size="md" className="w-full max-w-72" placeholder="Medium" />
      <Composer size="lg" className="w-full max-w-72" placeholder="Large" />
    </div>
  );
}
