import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@horon/web";
import { InboxIcon } from "lucide-react";

export default function EmptyDemo() {
  return (
    <>
      <Empty className="w-80">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>메시지가 없습니다</EmptyTitle>
          <EmptyDescription>새 메시지가 도착하면 이곳에 표시됩니다.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            새로고침
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className="w-80">
        <EmptyHeader>
          <EmptyTitle>저장된 항목이 없습니다</EmptyTitle>
          <EmptyDescription>필터를 바꾸거나 새 항목을 추가해 보세요.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </>
  );
}
