import { Icon } from "../../src/icons";
import { Input } from "../../src/components/input";

import { Backdrop } from "./backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <view className="flex flex-row flex-wrap items-end justify-center gap-3">
        <Input className="w-44" surface={surface} size="sm" placeholder="Small" />
        <Input className="w-44" surface={surface} placeholder="Medium" />
        <Input className="w-44" surface={surface} size="lg" placeholder="Large" />
      </view>
      <Input
        className="w-full max-w-72"
        surface={surface}
        icon={<Icon name="MagnifyingGlass" size={16} color="text-secondary" />}
        placeholder="Search bots"
      />
      <Input className="w-full max-w-72" surface={surface} invalid defaultValue="Inbox Manager" />
      <Input className="w-full max-w-72" surface={surface} disabled placeholder="Search bots" />
    </view>
  );
}

export default function InputDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
      <view className="flex flex-col items-center gap-4">
        <text className="text-caption text-text-secondary">Solid on page</text>
        <Input
          className="w-full max-w-72"
          surface="solid-on-page"
          icon={<Icon name="MagnifyingGlass" size={16} color="text-secondary" />}
          placeholder="Search bots"
        />
      </view>
    </view>
  );
}
