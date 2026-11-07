/**
 * Static facsimile of the pill tab tray: the selection is one indicator that `Tabs` positions
 * after measuring, and the index never hydrates, so the active chrome is drawn here.
 */
const tabs = [
  { value: "activity", label: "Activity", count: 12 },
  { value: "routines", label: "Routines", count: 4 },
  { value: "tools", label: "Tools", count: 3 },
];

export default function TabsThumbnail() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex w-fit items-center gap-0.5 rounded-full border border-border-default bg-bg-surface p-[3px]">
        {tabs.map((tab, index) => {
          const active = index === 0;
          return (
            <span
              key={tab.value}
              className={`flex h-7.5 items-center gap-1.5 rounded-full px-4 text-label-md whitespace-nowrap ${
                active ? "bg-overlay-ink-10 text-text-primary" : "text-text-secondary"
              }`}
            >
              <span className="text-trim">{tab.label}</span>
              <span
                className={`inline-flex h-5 items-center rounded-full px-1.5 text-label-sm ${
                  active
                    ? "bg-interactive-primary text-interactive-on-primary"
                    : "bg-overlay-ink-6 text-text-secondary"
                }`}
              >
                <span className="text-trim">{tab.count}</span>
              </span>
            </span>
          );
        })}
      </div>
      <p className="text-body-md text-text-secondary">Recent runs show up here.</p>
    </div>
  );
}
