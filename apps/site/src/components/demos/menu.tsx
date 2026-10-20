import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@horon/web";

export default function MenuDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Menu>
        <MenuLabel>세션</MenuLabel>
        <MenuItem>새 에이전트</MenuItem>
        <MenuItem>콘솔 열기</MenuItem>
        <MenuSeparator />
        <MenuItem>이름 변경</MenuItem>
        <MenuItem className="opacity-50">삭제</MenuItem>
      </Menu>
      <Menu className="w-[220px]">
        <MenuLabel>정렬</MenuLabel>
        <MenuItem>이름순</MenuItem>
        <MenuItem>최근 수정순</MenuItem>
      </Menu>
    </div>
  );
}
