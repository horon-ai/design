import { Kbd } from "@horon-ai/react";

export default function KbdCombos() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Kbd keys="Mod+K" />
        <Kbd keys="Mod+Enter" />
        <Kbd keys="Mod+Shift+P" />
        <Kbd keys="Escape" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Kbd keys="Alt+ArrowUp" />
        <Kbd keys="Shift+ArrowDown" />
        <Kbd keys="Mod+E" />
      </div>
    </div>
  );
}
