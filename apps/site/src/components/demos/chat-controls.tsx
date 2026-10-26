import { JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ChatControlsDemo() {
  return (
    <Backdrop>
      <JumpToLatest />
      <NewMessagesPill>3 new messages</NewMessagesPill>
      <VoiceInput elapsed="0:07" />
    </Backdrop>
  );
}
