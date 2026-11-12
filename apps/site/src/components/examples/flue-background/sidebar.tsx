import { FlueBackground, HoronGlyph } from "@horon-ai/react";
import type { HoronIconName } from "@horon-ai/react";

const items: { id: string; label: string; icon: HoronIconName }[] = [
  { id: "home", label: "Home", icon: "house" },
  { id: "bots", label: "Bots", icon: "bot" },
  { id: "files", label: "Files", icon: "folder" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function FlueBackgroundSidebar() {
  return (
    <div className="relative isolate flex min-h-96 w-full max-w-80 flex-col gap-6 overflow-hidden rounded-xl border border-border-default bg-bg-default p-4 text-text-primary">
      <FlueBackground variant="sidebar" />
      <span className="relative text-label-md font-semibold">Horon</span>
      <nav className="relative flex flex-col gap-1">
        {items.map((item) => (
          <span key={item.id} className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-label-md">
            <HoronGlyph name={item.icon} size={20} />
            {item.label}
          </span>
        ))}
      </nav>
      <span className="flex-1" />
      <span className="relative flex items-center gap-2 text-caption text-text-secondary">
        <HoronGlyph name="user" size={16} />
        alpox
      </span>
    </div>
  );
}
