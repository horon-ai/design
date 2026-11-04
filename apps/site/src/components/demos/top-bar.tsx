import { TopBar } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TopBarDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Backdrop className="flex-col">
        <TopBar
          className="w-full max-w-97.5"
          surface="glass"
          title="Chief of staff"
          subtitle="Online"
          live
          onBack={() => undefined}
        />
        <TopBar
          className="w-full max-w-97.5"
          surface="glass"
          title="Chief of staff"
          subtitle="Last active 2h ago"
          onBack={() => undefined}
        />
        <TopBar
          className="w-full max-w-97.5"
          surface="glass"
          title="Quarterly planning with the whole hiring team"
          onBack={() => undefined}
        />
      </Backdrop>
      <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-bg-default p-4">
        <TopBar className="w-full max-w-97.5" title="Chief of staff" subtitle="Online" live onBack={() => undefined} />
        <TopBar
          className="w-full max-w-97.5"
          title="Chief of staff"
          subtitle="Last active 2h ago"
          onBack={() => undefined}
        />
      </div>
    </div>
  );
}
