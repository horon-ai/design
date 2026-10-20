import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@horon-ai/react";

export default function ResizableDemo() {
  return (
    <div className="h-56 w-full max-w-[36rem] overflow-hidden rounded-md border border-border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="32%" minSize="20%">
          <div className="flex h-full flex-col gap-1.5 p-4">
            <span className="text-sm font-semibold text-foreground">목록</span>
            <span className="text-[13px] text-muted-foreground">받은 편지함</span>
            <span className="text-[13px] text-muted-foreground">임시 보관함</span>
            <span className="text-[13px] text-muted-foreground">보낸 편지함</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="68%">
          <div className="flex h-full flex-col gap-2 p-4">
            <span className="text-sm font-semibold text-foreground">선택한 메시지</span>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              가운데 손잡이를 끌어 두 패널의 너비를 바꿉니다.
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
