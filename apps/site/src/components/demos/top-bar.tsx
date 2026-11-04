import { TopBar } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Bars({ surface }: { surface: "solid" | "glass" }) {
  return (
    <>
      <TopBar
        className="w-full max-w-97.5"
        surface={surface}
        title="Chief of staff"
        subtitle="Online"
        live
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <TopBar
        className="w-full max-w-97.5"
        surface={surface}
        title="Chief of staff"
        subtitle="Last active 2h ago"
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <TopBar
        className="w-full max-w-97.5"
        surface={surface}
        title="Quarterly planning with the whole hiring team"
        onBack={() => undefined}
        onMore={() => undefined}
      />
    </>
  );
}

export default function TopBarDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-col items-center gap-4">
          <Bars surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <Bars surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
