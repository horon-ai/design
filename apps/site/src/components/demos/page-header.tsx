import { IconButton, PageHeader, SegmentedControl } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function PageHeaderDemo() {
  return (
    <Backdrop>
      <PageHeader
        className="w-97.5"
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
          items={["All", "Running", "Done", "Failed"].map((label) => ({ value: label.toLowerCase(), label }))}
        />
      </PageHeader>
    </Backdrop>
  );
}
