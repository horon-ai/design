import { PageHeader } from "../../src/components/page-header";
import { IconButton } from "../../src/components/icon-button";
import { SegmentedControl } from "../../src/components/segmented-control";
import { Icon } from "../../src/icons";

import { Backdrop } from "./backdrop";

const filters = ["All", "Running", "Done", "Failed"].map((label) => ({ value: label.toLowerCase(), label }));

/** A titled header with a back button, a search action and the status filter row. */
function Header({ surface }: { surface: "solid" | "glass" }) {
  return (
    <PageHeader
      className="w-full max-w-[390px]"
      surface={surface}
      title="Routines"
      onBack={() => undefined}
      actions={<IconButton icon={<Icon name="MagnifyingGlass" size={20} color="text-primary" />} label="Search" />}
    >
      <SegmentedControl aria-label="Status" surface="inset-faint" fill={false} defaultValue="running" items={filters} />
    </PageHeader>
  );
}

/** Solid over the page and glass over the backdrop, each with the filter row. */
export default function PageHeaderDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-row justify-center">
          <Header surface="solid" />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop>
          <Header surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
