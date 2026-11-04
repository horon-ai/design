import { IconButton, PageHeader, SegmentedControl } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

const filters = ["All", "Running", "Done", "Failed"].map((label) => ({ value: label.toLowerCase(), label }));

export default function PageHeaderDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop>
        <PageHeader
          className="w-97.5"
          surface="glass"
          title="Routines"
          onBack={() => undefined}
          actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}
        >
          <SegmentedControl
            aria-label="Status"
            surface="inset-faint"
            fill={false}
            className="h-9 px-[3px]"
            defaultValue="running"
            items={filters}
          />
        </PageHeader>
      </Backdrop>
      <div className="flex w-full justify-center rounded-2xl bg-bg-default p-4">
        <PageHeader
          className="w-97.5"
          title="Routines"
          onBack={() => undefined}
          actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}
        >
          <SegmentedControl
            aria-label="Status"
            surface="subtle"
            fill={false}
            className="h-9 px-[3px]"
            defaultValue="running"
            items={filters}
          />
        </PageHeader>
      </div>
    </div>
  );
}
