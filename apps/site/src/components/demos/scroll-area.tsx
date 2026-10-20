import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@horon-ai/react";

const logs = [
  "세션 시작: design-site 빌드",
  "토큰을 다시 계산했습니다.",
  "컴포넌트 12개를 렌더했습니다.",
  "스크린샷 3장을 저장했습니다.",
  "타입 검사를 통과했습니다.",
  "린트 경고가 없습니다.",
  "테스트 48개가 통과했습니다.",
  "번들을 gzip으로 41KB 만들었습니다.",
  "미리보기를 배포했습니다.",
  "세션을 종료했습니다.",
];

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-60 w-80 rounded-md border border-border">
      <ScrollAreaViewport>
        <div className="flex flex-col gap-2.5 p-4 text-[13px] leading-relaxed">
          {logs.map((line, index) => (
            <p key={line} className="flex gap-2">
              <span className="tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </p>
          ))}
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb className="flex-none" />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  );
}
