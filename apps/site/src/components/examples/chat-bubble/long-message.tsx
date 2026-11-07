import { ChatBubble } from "@horon-ai/react";

export default function ChatBubbleLongMessage() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ChatBubble from="bot">
        The overnight run filed 41 emails and left six for you: two invoices that need a code, one contract redline from
        legal, two customer escalations and a meeting invite that conflicts with Thursday&apos;s review. I drafted replies
        for the escalations and left the invoices untouched.
      </ChatBubble>
      <ChatBubble from="me">Leave the contract for the morning.</ChatBubble>
    </div>
  );
}
