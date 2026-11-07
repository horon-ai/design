import { Kbd } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function KbdInContext() {
  return (
    <div className="flex w-full max-w-80 items-center gap-2 rounded-full border border-border-default bg-bg-surface px-3 py-2 text-body-sm text-text-secondary">
      <MagnifyingGlass aria-hidden className="size-4 shrink-0" />
      <span className="min-w-0 flex-1">Search agents</span>
      <Kbd size="sm" keys="Mod+K" />
    </div>
  );
}
