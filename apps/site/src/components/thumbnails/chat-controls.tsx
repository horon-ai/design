import { JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/react";

export default function ChatControlsThumbnail() {
  return (
    <div className="flex w-60 flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <JumpToLatest />
        <NewMessagesPill>New messages</NewMessagesPill>
      </div>
      <VoiceInput elapsed="0:07" recording={false} />
    </div>
  );
}
