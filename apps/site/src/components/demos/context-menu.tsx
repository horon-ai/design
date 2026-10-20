import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@horon-ai/react";

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-72 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 text-sm">
        <span className="font-medium">오른쪽 버튼으로 클릭</span>
        <span className="text-[13px] text-muted-foreground">메뉴는 클릭할 때 열립니다.</span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>탐색</ContextMenuLabel>
        <ContextMenuItem>뒤로</ContextMenuItem>
        <ContextMenuItem>앞으로</ContextMenuItem>
        <ContextMenuItem>새로 고침</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>링크 복사</ContextMenuItem>
        <ContextMenuItem disabled>요소 검사</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
