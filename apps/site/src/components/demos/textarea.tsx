import { Textarea } from "@horon/web";

export default function TextareaDemo() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Textarea placeholder="메시지" />
      <Textarea defaultValue="전송할 내용을 적었습니다." />
      <Textarea placeholder="비활성" disabled />
    </div>
  );
}
