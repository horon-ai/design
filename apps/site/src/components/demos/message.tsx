import {
  Avatar,
  AvatarFallback,
  Bubble,
  BubbleContent,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@horon/web";

export default function MessageDemo() {
  return (
    <div className="flex w-96 flex-col gap-4">
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>호론</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>호론 도우미</MessageHeader>
          <Bubble variant="muted" align="start">
            <BubbleContent>색상 팔레트를 토큰 패키지로 옮겼습니다. 컴포넌트도 이어서 바꿀까요?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>민열</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>민열</MessageHeader>
          <Bubble variant="default" align="end">
            <BubbleContent>네, 유리 표면 규칙은 그대로 두고 진행해 주세요.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}
