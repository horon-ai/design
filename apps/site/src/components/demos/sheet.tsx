import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@horon-ai/react";

export default function SheetDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>패널 열기</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>프로필 수정</SheetTitle>
            <SheetDescription>이름을 바꾸고 저장을 누르면 바로 반영됩니다.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-1.5 px-4">
            <Label htmlFor="demo-sheet-name">이름</Label>
            <Input id="demo-sheet-name" defaultValue="민열" />
          </div>
          <SheetFooter>
            <Button>저장</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <p className="text-[12px] text-muted-foreground">버튼을 누르면 오른쪽에서 패널이 열립니다.</p>
    </div>
  );
}
