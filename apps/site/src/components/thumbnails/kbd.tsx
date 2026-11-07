import { Kbd } from "@horon-ai/react";

export default function KbdThumbnail() {
  return (
    <div className="flex w-64 flex-col gap-3.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-body-sm text-text-secondary">Open search</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <Kbd size="lg" keys="Mod" />
          <Kbd size="lg">K</Kbd>
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-body-sm text-text-secondary">New bot</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <Kbd size="lg" keys="Mod" />
          <Kbd size="lg">N</Kbd>
        </span>
      </div>
    </div>
  );
}
