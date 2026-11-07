import { IconButton, PageHeader } from "@horon-ai/react";
import { MagnifyingGlass, DotsThree } from "@phosphor-icons/react";

/** The header filter is `SegmentedControl`'s `inset-faint` track; its sliding pill is measured after
 * mount, so the selected segment is drawn statically here. */
const filters = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" },
];

export default function PageHeaderThumbnail() {
  return (
    <PageHeader
      className="w-80"
      title="Routines"
      onBack={() => undefined}
      actions={
        <span className="flex items-center gap-1">
          <IconButton icon={<MagnifyingGlass />} label="Search" />
          <IconButton icon={<DotsThree weight="bold" />} label="More" />
        </span>
      }
    >
      <span className="inline-flex w-fit items-center gap-0.5 rounded-full bg-overlay-ink-4 p-[3px]">
        {filters.map((filter, index) => (
          <span
            key={filter.value}
            className={`flex h-7.5 items-center rounded-full px-4 text-label-md whitespace-nowrap ${
              index === 1 ? "bg-overlay-ink-10 text-text-primary" : "text-text-secondary"
            }`}
          >
            <span className="text-trim">{filter.label}</span>
          </span>
        ))}
      </span>
    </PageHeader>
  );
}
