import { ChatBubble } from "@horon-ai/react";

export default function ChatBubbleConversation() {
  return (
    <div className="flex w-full max-w-120 flex-col gap-2">
      <ChatBubble from="me">What needs my attention today?</ChatBubble>
      <ChatBubble from="bot">Overnight: 41 new emails, 6 need you. The rest are filed.</ChatBubble>
      <ChatBubble from="me">Send the six summaries to the board channel.</ChatBubble>
      <ChatBubble from="bot">Done. The summaries are in #board and the senders have been tagged.</ChatBubble>
    </div>
  );
}
