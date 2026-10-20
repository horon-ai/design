import { Separator } from "@horon/web";

export default function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-[13px]">
      <div>
        <p>계정 설정</p>
        <Separator className="my-3" />
        <p>알림과 공개 범위를 관리합니다.</p>
      </div>
      <div className="flex h-5 items-center gap-3">
        <span>초안</span>
        <Separator orientation="vertical" />
        <span>수정됨</span>
        <Separator orientation="vertical" />
        <span>공개</span>
      </div>
    </div>
  );
}
