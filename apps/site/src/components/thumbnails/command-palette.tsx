import { Kbd } from "@horon-ai/react";
import { Folder, MagnifyingGlass } from "@phosphor-icons/react";

const items = [
  {
    label: "Chief of staff",
    meta: "Horon HQ",
    tile: "C",
    tileClassName: "bg-interactive-primary text-interactive-on-primary",
    highlighted: true,
  },
  {
    label: "Q4 hiring",
    meta: "Projects",
    tile: <Folder />,
    tileClassName: "bg-overlay-ink-5 text-text-primary",
    highlighted: false,
  },
];

/** Static facsimile of the open palette: search row, one group of results and the hint footer. */
export default function CommandPaletteThumbnail() {
  return (
    <div className="flex w-80 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface p-1 shadow-palette">
      <div className="flex h-11 items-center gap-2.5 px-3">
        <span className="flex size-7 shrink-0 items-center justify-center">
          <MagnifyingGlass aria-hidden className="size-5 text-text-secondary" />
        </span>
        <span className="min-w-0 flex-1 truncate text-body-sm text-text-secondary">Search bots and projects</span>
        <Kbd>esc</Kbd>
      </div>
      <div className="h-px bg-overlay-ink-8" />
      <div className="flex flex-col">
        <span className="px-3 pt-2 pb-1 text-caption text-text-secondary">Recent</span>
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex h-11 items-center gap-2.5 rounded-md px-3 ${item.highlighted ? "bg-overlay-ink-6" : ""}`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-sm text-label-sm [&>svg]:size-4 ${item.tileClassName}`}
            >
              {item.tile}
            </span>
            <span className="truncate text-label-md text-text-primary">{item.label}</span>
            <span className="shrink-0 text-caption text-text-secondary">{item.meta}</span>
            <span className="flex-1" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 px-3 pt-1.5 pb-1">
        <span className="flex items-center gap-1.5 text-caption text-text-secondary">
          <Kbd>↑↓</Kbd>
          Move
        </span>
        <span className="flex items-center gap-1.5 text-caption text-text-secondary">
          <Kbd>↵</Kbd>
          Open
        </span>
      </div>
    </div>
  );
}
