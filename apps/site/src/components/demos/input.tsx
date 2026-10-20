import { Input } from "@horon/web";

export default function InputDemo() {
  return (
    <div className="flex w-72 flex-col gap-3">
      <Input type="email" placeholder="이메일" />
      <Input placeholder="비활성" disabled />
    </div>
  );
}
