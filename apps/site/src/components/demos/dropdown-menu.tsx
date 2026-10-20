import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horon/web";

export default function DropdownMenuDemo() {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>작업</DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>세션</DropdownMenuLabel>
        <DropdownMenuItem>새 에이전트</DropdownMenuItem>
        <DropdownMenuItem>콘솔 열기</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem defaultChecked>사이드바 표시</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>미니맵 표시</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>이름 변경</DropdownMenuItem>
        <DropdownMenuItem disabled>삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
