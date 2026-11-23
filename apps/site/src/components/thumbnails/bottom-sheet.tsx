import { Bell, CalendarBlank, CaretRight } from "@phosphor-icons/react";

const rows = [
  { icon: <Bell />, label: "Notifications", value: "On" },
  { icon: <CalendarBlank />, label: "Schedule", value: "Daily" },
];

/** Static facsimile of the docked bottom sheet: dimmed page behind, flush at left/right/bottom with safe-area space. */
export default function BottomSheetThumbnail() {
  return (
    <div className="flex h-48 w-60 flex-col overflow-hidden rounded-xl border border-border-default bg-bg-default">
      <div className="relative flex flex-1 flex-col justify-center gap-1.5 px-4">
        <p className="text-label-sm text-text-secondary">Workspace</p>
        <p className="text-body-sm text-text-primary">Daily digest at 09:00</p>
        <span aria-hidden className="absolute inset-0 bg-bg-scrim/32" />
      </div>
      <div className="flex flex-col items-stretch rounded-t-xl border-t border-border-default bg-bg-surface px-4 pt-1.5 pb-4">
        <span aria-hidden className="mx-auto h-[5px] w-9 rounded-full bg-overlay-ink-20" />
        <div className="flex items-center pt-2 pb-1.5 pl-2">
          <p className="min-w-0 flex-1 text-label-lg text-text-primary">Chief of staff</p>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="flex h-10 items-center gap-3 rounded-sm px-2">
            <span className="flex shrink-0 text-text-secondary [&>svg]:size-5">{row.icon}</span>
            <span className="min-w-0 flex-1 truncate text-label-md text-text-primary">{row.label}</span>
            <span className="shrink-0 text-body-sm text-text-secondary">{row.value}</span>
            <CaretRight aria-hidden className="size-4 shrink-0 text-text-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
