import { CaretDown, Check, MagnifyingGlass } from "@phosphor-icons/react";

/**
 * Static facsimile of the searchable field and its list: the popup is portalled on hydration,
 * so the field and rows are drawn here with the classes `Combobox` itself uses.
 */
export default function ComboboxThumbnail() {
  return (
    <div className="flex w-60 flex-col gap-1">
      <div className="relative flex h-10 min-w-0 items-center gap-2 rounded-md border border-border-default bg-bg-surface px-3.5 text-body-md text-text-primary">
        <MagnifyingGlass aria-hidden className="size-4 shrink-0 text-text-secondary" />
        <span className="min-w-0 flex-1 truncate">Chief of staff</span>
        <CaretDown aria-hidden className="size-4 shrink-0 text-text-secondary" />
      </div>
      <div className="overflow-clip rounded-xl border border-border-default bg-bg-surface p-1.5 shadow-popover">
        <div className="flex flex-col gap-0.5">
          <div className="flex h-10 items-center gap-2.5 rounded-md bg-overlay-ink-6 px-3 text-label-md text-text-primary">
            <span className="min-w-0 flex-1 truncate">Chief of staff</span>
            <Check aria-hidden className="size-4 shrink-0" />
          </div>
          <div className="flex h-10 items-center gap-2.5 rounded-md px-3 text-label-md text-text-primary">
            <span className="min-w-0 flex-1 truncate">Researcher</span>
          </div>
        </div>
      </div>
    </div>
  );
}
