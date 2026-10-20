import { Checkbox, Label } from "@horon-ai/react";

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox aria-label="선택 안 됨" />
      <Checkbox defaultChecked aria-label="선택됨" />
      <Checkbox disabled aria-label="비활성" />
      <Label>
        <Checkbox defaultChecked />
        알림 받기
      </Label>
    </div>
  );
}
