import { ChatBubble } from "@horon-ai/react";

export default function ChatBubbleDemo() {
  return (
    <div className="flex w-full max-w-120 flex-col gap-3">
      <ChatBubble from="me">What needs my attention today?</ChatBubble>
      <ChatBubble from="bot">Overnight: 41 new emails, 6 need you. The rest are filed.</ChatBubble>
    </div>
  );
}
