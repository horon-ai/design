import { JumpToLatest } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function ChatControlsJump() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <JumpToLatest onClick={() => undefined} />
      <Backdrop>
        <JumpToLatest surface="glass" onClick={() => undefined} />
      </Backdrop>
    </div>
  );
}
