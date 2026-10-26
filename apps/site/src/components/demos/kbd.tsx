import { Kbd } from "@horon-ai/react";

export default function KbdDemo() {
  return (
    <div className="flex items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>esc</Kbd>
    </div>
  );
}
