import { Kbd } from "@horon-ai/react";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <Kbd>esc</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <Kbd size="sm">K</Kbd>
        <Kbd size="md">K</Kbd>
        <Kbd size="lg">K</Kbd>
      </div>
    </div>
  );
}
