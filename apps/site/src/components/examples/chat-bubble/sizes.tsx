import { ChatBubble } from "@horon-ai/react";

export default function ChatBubbleSizes() {
  return (
    <div className="flex w-full max-w-120 flex-col gap-3">
      <ChatBubble from="bot" size="sm">
        Small bubble for a one-word answer.
      </ChatBubble>
      <ChatBubble from="bot" size="md">
        Default bubble with the body size a chat thread reads at.
      </ChatBubble>
      <ChatBubble from="me" size="lg">
        Large bubble for the message a thread opens with.
      </ChatBubble>
    </div>
  );
}
