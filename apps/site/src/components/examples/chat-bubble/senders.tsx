import { ChatBubble } from "@horon-ai/react";

export default function ChatBubbleSenders() {
  return (
    <div className="flex w-full max-w-120 flex-col gap-2">
      <ChatBubble from="bot">I can draft the reply and keep it in your voice.</ChatBubble>
      <ChatBubble from="me">Draft it, then show me before it goes out.</ChatBubble>
    </div>
  );
}
