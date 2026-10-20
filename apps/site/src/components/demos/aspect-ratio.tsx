import { AspectRatio } from "@horon/web";

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio className="rounded-md border border-border bg-muted">
        <div className="flex size-full flex-col items-center justify-center gap-1">
          <span className="text-[13px] font-medium text-foreground">16 : 9</span>
          <span className="text-[12px] text-muted-foreground">썸네일 미리보기</span>
        </div>
      </AspectRatio>
    </div>
  );
}
