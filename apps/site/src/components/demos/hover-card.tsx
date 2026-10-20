import { HoverCard, HoverCardContent, HoverCardTrigger } from "@horon-ai/react";

export default function HoverCardDemo() {
  return (
    <HoverCard defaultOpen>
      <HoverCardTrigger href="https://horon.ai" className="text-sm font-medium text-primary underline underline-offset-4">
        @horon
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Horon</span>
          <span className="text-[13px] text-muted-foreground">
            디자인 시스템과 컴포넌트 라이브러리입니다. 링크에 올리면 이 카드가 열립니다.
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
