import { Bubble, BubbleContent, BubbleGroup } from "@horon-ai/react";

export default function BubbleDemo() {
  return (
    <BubbleGroup className="w-96">
      <Bubble align="start" variant="muted">
        <BubbleContent>토큰 내보내기는 어떻게 하나요?</BubbleContent>
      </Bubble>
      <Bubble align="end" variant="default">
        <BubbleContent>토큰을 빌드한 뒤 theme.css를 앱에 복사하면 됩니다.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="outline">
        <BubbleContent>간격 값도 그대로 유지되나요?</BubbleContent>
      </Bubble>
    </BubbleGroup>
  );
}
