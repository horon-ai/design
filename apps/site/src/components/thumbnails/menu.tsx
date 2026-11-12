import { Button } from "@horon-ai/react";
import { ArrowsClockwise, Copy, Trash } from "@phosphor-icons/react";

const items = [
  { icon: <Copy />, label: "Copy", trailing: "⌘C", danger: false },
  { icon: <ArrowsClockwise />, label: "Regenerate", trailing: null, danger: false },
  { icon: <Trash />, label: "Delete", trailing: null, danger: true },
];

/** Static facsimile of the open menu anchored under its trigger. */
export default function MenuThumbnail() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="solid" size="sm">
        Message actions
      </Button>
      <div className="flex w-56 flex-col gap-0.5 overflow-clip rounded-xl bg-glass-fill-solid p-1.5 shadow-popover">
        {items.map((item) => (
          <div key={item.label} className="flex h-9 items-center gap-2.5 rounded-md px-2.5">
            <span
              className={`flex shrink-0 [&>svg]:size-4.5 ${item.danger ? "text-text-danger" : "text-text-primary"}`}
            >
              {item.icon}
            </span>
            <span className={`min-w-0 flex-1 truncate text-label-md ${item.danger ? "text-text-danger" : "text-text-primary"}`}>
              {item.label}
            </span>
            {item.trailing && <span className="shrink-0 text-caption text-text-secondary">{item.trailing}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
