import { TopBar } from "../../src/components/top-bar";
import { Backdrop } from "./backdrop";

/** Three bars per surface: live, last-active and a long title, mirroring the site demo. */
function Bars({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col gap-3">
      <TopBar
        className="w-full max-w-[390px]"
        surface={surface}
        title="Chief of staff"
        subtitle="Online"
        live
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <TopBar
        className="w-full max-w-[390px]"
        surface={surface}
        title="Chief of staff"
        subtitle="Last active 2h ago"
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <TopBar
        className="w-full max-w-[390px]"
        surface={surface}
        title="Quarterly planning with the whole hiring team"
        onBack={() => undefined}
        onMore={() => undefined}
      />
    </view>
  );
}

/** Solid and glass bars, each with the back button, the live avatar and the overflow action. */
export default function TopBarDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Bars surface="solid" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <Bars surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
