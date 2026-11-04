import { JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ChatControlsDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <JumpToLatest surface="glass" />
        <NewMessagesPill surface="glass">3 new messages</NewMessagesPill>
        <VoiceInput surface="glass" elapsed="0:07" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <JumpToLatest />
        <NewMessagesPill>3 new messages</NewMessagesPill>
        <VoiceInput elapsed="0:07" />
      </div>
    </Backdrop>
  );
}
