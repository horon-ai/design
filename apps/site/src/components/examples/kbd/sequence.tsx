import { Kbd } from "@horon-ai/react";
import { CaretRight } from "@phosphor-icons/react";

export default function KbdSequence() {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex items-center gap-2 text-body-sm text-text-secondary">
        <Kbd size="sm">G</Kbd>
        <CaretRight aria-hidden className="size-3" />
        <Kbd size="sm">I</Kbd>
        <span className="ml-1">Go to inbox</span>
      </span>
      <span className="flex items-center gap-2 text-body-sm text-text-secondary">
        <Kbd size="sm">G</Kbd>
        <CaretRight aria-hidden className="size-3" />
        <Kbd size="sm">S</Kbd>
        <span className="ml-1">Go to settings</span>
      </span>
    </div>
  );
}
