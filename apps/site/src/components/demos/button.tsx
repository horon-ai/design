import { Button } from "@horon/web";

export default function ButtonDemo() {
  return (
    <>
      <Button>저장</Button>
      <Button variant="outline">취소</Button>
      <Button variant="secondary">보조</Button>
      <Button variant="ghost">고스트</Button>
      <Button variant="destructive">삭제</Button>
      <Button variant="link">링크</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>비활성</Button>
    </>
  );
}
