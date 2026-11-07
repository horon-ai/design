import { CaretDown, Check } from "@phosphor-icons/react";

/**
 * Static facsimile of the open select: the trigger and the popup render through a portal on
 * hydration, so the field and list are drawn here with the classes `Select` itself uses (SM rung).
 */
const items = ["Chief of staff", "Researcher", "Writer"];

export default function SelectThumbnail() {
  return (
    <div className="flex w-60 flex-col gap-1">
      <div className="relative flex h-8 min-w-0 items-center gap-1.5 rounded-md border border-border-default bg-bg-surface px-3 text-body-sm text-text-primary">
        <span className="min-w-0 flex-1 truncate">Writer</span>
        <CaretDown aria-hidden className="size-4 shrink-0 text-text-secondary" />
      </div>
      <div className="overflow-clip rounded-xl border border-border-default bg-bg-surface p-1.5 shadow-popover">
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <div
              key={item}
              className={`flex h-8 items-center gap-2 rounded-md px-2.5 text-label-sm text-text-primary ${
                item === "Writer" ? "bg-overlay-ink-6" : ""
              }`}
            >
              <span className="min-w-0 flex-1 truncate">{item}</span>
              {item === "Writer" ? <Check aria-hidden className="size-4 shrink-0" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
