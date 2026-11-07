/**
 * Static facsimile of the filter bar: the selected option sits on a sliding ink pill that `FilterBar`
 * places after measuring, and the index never hydrates, so the pill is drawn on the option here.
 */
const items = [
  { value: "all", label: "All", count: 4 },
  { value: "running", label: "Running", count: 1 },
  { value: "review", label: "Needs review", count: 1 },
];

export default function FilterBarThumbnail() {
  return (
    <div className="inline-flex w-fit items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]">
      {items.map((item, index) => {
        const active = index === 0;
        return (
          <span
            key={item.value}
            className={`flex h-7.5 items-center gap-1.5 rounded-full px-4 whitespace-nowrap ${
              active ? "bg-overlay-ink-10 text-text-primary" : "text-text-secondary"
            }`}
          >
            <span className="text-label-md">{item.label}</span>
            <span className="text-caption text-text-secondary">{item.count}</span>
          </span>
        );
      })}
    </div>
  );
}
