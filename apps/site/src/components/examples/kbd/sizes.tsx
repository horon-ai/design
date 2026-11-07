import { Kbd } from "@horon-ai/react";

export default function KbdSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <span className="flex flex-col items-center gap-2">
        <Kbd size="sm" keys="Mod+K" />
        <span className="text-caption text-text-secondary">sm</span>
      </span>
      <span className="flex flex-col items-center gap-2">
        <Kbd size="md" keys="Mod+K" />
        <span className="text-caption text-text-secondary">md</span>
      </span>
      <span className="flex flex-col items-center gap-2">
        <Kbd size="lg" keys="Mod+K" />
        <span className="text-caption text-text-secondary">lg</span>
      </span>
    </div>
  );
}
