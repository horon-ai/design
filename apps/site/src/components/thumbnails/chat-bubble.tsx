import { ChatBubble } from "@horon-ai/react";

export default function ChatBubbleThumbnail() {
  return (
    <div className="flex w-72 flex-col gap-2 rounded-xl bg-bg-surface p-3">
      <ChatBubble from="bot">Overnight: 6 emails need you.</ChatBubble>
      <ChatBubble from="me">Draft replies for the top three.</ChatBubble>
    </div>
  );
}
