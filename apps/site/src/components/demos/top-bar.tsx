import { TopBar } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function TopBarDemo() {
  return (
    <Backdrop className="flex-col">
      <TopBar className="w-97.5" title="Chief of staff" subtitle="Online" live onBack={() => undefined} />
      <TopBar className="w-97.5" title="Chief of staff" subtitle="Last active 2h ago" onBack={() => undefined} />
      <TopBar className="w-97.5" title="Quarterly planning with the whole hiring team" onBack={() => undefined} />
    </Backdrop>
  );
}
