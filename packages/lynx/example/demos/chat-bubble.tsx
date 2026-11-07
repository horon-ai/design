import { ChatBubble } from "../../src/components/chat-bubble";

/**
 * The two senders at the three rungs. `me` pushes right on the ink fill, `bot`
 * stays left on the subtle fill, exactly as the site demo shows it.
 */
export default function ChatBubbleDemo() {
  return (
    <view className="flex w-full max-w-[480px] flex-col gap-3">
      <ChatBubble from="me">What needs my attention today?</ChatBubble>
      <ChatBubble from="bot">Overnight: 41 new emails, 6 need you. The rest are filed.</ChatBubble>
      <view className="flex flex-col gap-2">
        <ChatBubble from="me" size="sm">
          Small bubble.
        </ChatBubble>
        <ChatBubble from="bot" size="md">
          Default bubble.
        </ChatBubble>
        <ChatBubble from="me" size="lg">
          Large bubble.
        </ChatBubble>
      </view>
    </view>
  );
}
