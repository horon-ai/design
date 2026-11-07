import { TopBar } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function TopBarSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <TopBar
        className="w-full max-w-97.5"
        surface="solid"
        title="Chief of staff"
        subtitle="Online"
        live
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <Backdrop className="flex-col">
        <TopBar
          className="w-full max-w-97.5"
          surface="glass"
          title="Chief of staff"
          subtitle="Online"
          live
          onBack={() => undefined}
          onMore={() => undefined}
        />
      </Backdrop>
    </div>
  );
}
