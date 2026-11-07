import { IconButton, PageHeader, SegmentedControl } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

const filters = ["All", "Running", "Done", "Failed"].map((label) => ({ value: label.toLowerCase(), label }));

export default function PageHeaderFilters() {
  return (
    <PageHeader
      className="w-full max-w-97.5"
      title="Routines"
      onBack={() => undefined}
      actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}
    >
      <SegmentedControl aria-label="Status" surface="inset-faint" fill={false} defaultValue="running" items={filters} />
    </PageHeader>
  );
}
