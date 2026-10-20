import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@horon/web";

export default function MenubarDemo() {
  return (
    <Menubar modal={false}>
      <MenubarMenu defaultOpen>
        <MenubarTrigger>파일</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>새 에이전트</MenubarItem>
          <MenubarItem>콘솔 열기</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>세션 저장</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>편집</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>실행 취소</MenubarItem>
          <MenubarItem>다시 실행</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>복사</MenubarItem>
          <MenubarItem>붙여넣기</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
