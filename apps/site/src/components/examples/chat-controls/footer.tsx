import { JumpToLatest, NewMessagesPill, VoiceInput } from "@horon-ai/react";

export default function ChatControlsFooter() {
  return (
    <div className="relative flex w-full max-w-120 flex-col items-center gap-6 rounded-2xl bg-bg-subtle p-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <NewMessagesPill onClick={() => undefined}>3 new messages</NewMessagesPill>
        <JumpToLatest onClick={() => undefined} />
      </div>
      <VoiceInput elapsed="0:07" onStop={() => undefined} />
    </div>
  );
}
