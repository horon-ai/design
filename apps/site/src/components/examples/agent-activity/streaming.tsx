import { StreamingText } from "@horon-ai/react";

export default function AgentActivityStreaming() {
  return (
    <div className="flex w-full max-w-85 flex-col items-start gap-3">
      <StreamingText text="Drafted replies for 2 of 6 emails. Working on the Larkspur invoice thread next" />
      <StreamingText
        text="Drafted replies for 2 of 6 emails. Next is the Larkspur invoice thread, then the two hiring follow-ups."
        streaming={false}
      />
    </div>
  );
}
