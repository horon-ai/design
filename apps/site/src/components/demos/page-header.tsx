import { IconButton, PageHeader, SegmentedControl } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

const filters = ["All", "Running", "Done", "Failed"].map((label) => ({ value: label.toLowerCase(), label }));

function Header({ surface }: { surface: "solid" | "glass" }) {
  return (
    <PageHeader
      className="w-97.5"
      surface={surface}
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
  );
}

export default function PageHeaderDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full justify-center">
          <Header surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <Header surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
