import { NewMessagesPill } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function ChatControlsNewMessages() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <NewMessagesPill onClick={() => undefined}>3 new messages</NewMessagesPill>
      <Backdrop>
        <NewMessagesPill surface="glass" onClick={() => undefined}>
          1 new message
        </NewMessagesPill>
      </Backdrop>
    </div>
  );
}
