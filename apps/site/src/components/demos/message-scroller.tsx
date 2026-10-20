import {
  Bubble,
  BubbleContent,
  Message,
  MessageContent,
  MessageHeader,
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
} from "@horon-ai/react";

const thread = [
  { from: "호론 도우미", align: "start" as const, body: "팔레트는 어디에 두면 좋을까요?" },
  { from: "민열", align: "end" as const, body: "@horon-ai/tokens에 단일 원본으로 두세요." },
  { from: "호론 도우미", align: "start" as const, body: "완료했습니다. theme.css를 다시 만들었습니다." },
  { from: "민열", align: "end" as const, body: "좋습니다. 이제 컴포넌트로 옮겨 주세요." },
  { from: "호론 도우미", align: "start" as const, body: "채팅 화면부터 시작합니다." },
  { from: "민열", align: "end" as const, body: "떠 있는 표면만 유리로 유지해 주세요." },
  { from: "호론 도우미", align: "start" as const, body: "알겠습니다. 장식 요소에만 유리를 씁니다." },
  { from: "민열", align: "end" as const, body: "스크롤러도 준비되면 보여 주세요." },
];

export default function MessageScrollerDemo() {
  return (
    <MessageScroller className="h-80 w-80 rounded-md border border-border">
      <MessageScrollerViewport className="p-4">
        <MessageScrollerContent>
          {thread.map((entry) => (
            <MessageScrollerItem key={`${entry.from}: ${entry.body}`}>
              <Message align={entry.align}>
                <MessageContent>
                  <MessageHeader>{entry.from}</MessageHeader>
                  <Bubble align={entry.align} variant={entry.align === "end" ? "default" : "muted"}>
                    <BubbleContent>{entry.body}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  );
}
