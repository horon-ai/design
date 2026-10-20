import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@horon/web";

export default function DrawerDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Drawer>
        <DrawerTrigger render={<Button variant="outline" />}>필터 열기</DrawerTrigger>
        <DrawerContent side="bottom">
          <DrawerHeader>
            <DrawerTitle>필터</DrawerTitle>
            <DrawerDescription>목록에 적용할 조건을 고릅니다.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 text-[13px] text-muted-foreground">최근 7일 · 읽지 않음</div>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>닫기</DrawerClose>
            <Button>적용</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className="text-[12px] text-muted-foreground">버튼을 누르면 아래에서 시트가 올라옵니다.</p>
    </div>
  );
}
