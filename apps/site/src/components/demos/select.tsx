import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@horon/web";

export default function SelectDemo() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Select defaultValue="apple">
        <SelectTrigger className="w-56">
          <SelectValue placeholder="과일 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">사과</SelectItem>
          <SelectItem value="banana">바나나</SelectItem>
          <SelectItem value="cherry">체리</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultOpen defaultValue="banana">
        <SelectTrigger className="w-56">
          <SelectValue placeholder="과일 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">사과</SelectItem>
          <SelectItem value="banana">바나나</SelectItem>
          <SelectItem value="cherry">체리</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
